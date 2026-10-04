from __future__ import annotations

import asyncio
import io
import json
import math
import random
import re
import secrets
import socket
import string
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import qrcode
import qrcode.image.svg
from aiohttp import WSMsgType, web, web_fileresponse

# Keep file transfers reliable with Windows/Python 3.14 SelectorEventLoop;
# its sendfile fallback can reuse buffers that are still queued for writing.
if sys.platform == "win32":
    web_fileresponse.NOSENDFILE = True
from network_settings import NetworkSettings, load_network_settings

NETWORK_SETTINGS_KEY = web.AppKey("network_settings", NetworkSettings)

from werewolf_engine import (
    ROLE_PRESETS,
    PRESET_LABELS,
    PlayerState,
    RoomState,
    add_notice,
    advance_discussion,
    advance_last_words,
    auto_abstain_wolf_votes,
    claim_next_join_order,
    can_exchange_voice,
    current_day_speaker,
    current_last_words_speaker,
    evaluate_winner,
    fill_missing_votes_as_abstain,
    finalize_vote,
    player_display_name,
    player_team,
    perform_hunter_shot,
    perform_knight_duel,
    perform_self_destruct,
    perform_white_wolf_king_blast,
    preset_rulebook,
    refresh_player_numbers,
    refresh_voice_policy,
    remove_player_from_room,
    room_payload,
    set_host_voice_penalty,
    set_voice_state,
    skip_guard,
    skip_hunter_shot,
    skip_seer,
    skip_white_wolf_king_blast,
    skip_witch,
    start_game,
    submit_guard,
    submit_seer,
    submit_vote,
    submit_witch,
    submit_wolf_chat,
    submit_wolf_vote,
    finish_wolf_discussion,
    update_ai_mode,
    update_room_config,
    wolves_in_room,
)

def runtime_root_dir() -> Path:
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).resolve().parent


ROOT_DIR = runtime_root_dir()
STATIC_DIR = ROOT_DIR / "static"
ROOM_CODE_ALPHABET = string.digits


@dataclass
class ConnectedRoom:
    room: RoomState
    sockets: dict[str, web.WebSocketResponse] = field(default_factory=dict)
    server_origin: str = ""
    network_settings: NetworkSettings = field(default_factory=NetworkSettings)
    created_at: float = field(default_factory=time.time)
    bot_task: asyncio.Task | None = None
    speech_task: asyncio.Task | None = None
    speech_deadline: float | None = None
    speech_actor_id: str | None = None
    speech_phase: str | None = None
    vote_task: asyncio.Task | None = None
    vote_deadline: float | None = None
    vote_round: int | None = None
    wolf_discussion_task: asyncio.Task | None = None
    wolf_discussion_deadline: float | None = None
    skill_task: asyncio.Task | None = None
    skill_deadline: float | None = None
    skill_phase: str | None = None
    skill_actor_id: str | None = None
    disconnect_tasks: dict[str, asyncio.Task] = field(default_factory=dict)


rooms: dict[str, ConnectedRoom] = {}
player_room_index: dict[web.WebSocketResponse, tuple[str, str]] = {}
BOT_NAME_POOL = [
    "阿尔法",
    "北境",
    "赤月",
    "渡鸦",
    "霜刃",
    "观星",
    "寒松",
    "流火",
    "秘银",
    "青岚",
    "山雀",
    "雾灯",
]
BOT_DISCUSSION_LINES = [
    "我先听了一圈，暂时觉得要把发言前后矛盾的人重点看住。",
    "这一轮信息还不够，但刚才那位的语气和票型让我有点在意。",
    "我建议大家先盘逻辑，不要光凭感觉乱投。",
    "如果后面没有更强信息，我会优先怀疑一直跟票又不给理由的人。",
    "这轮我先保留意见，但会继续盯着发言最飘的人。",
]
BOT_LAST_WORD_LINES = [
    "我的遗言是把刚才带节奏最明显的人记下来，下一轮重点看他。",
    "我先把信息留给好人，别被场上突然的强势发言带偏。",
    "如果我是好人位，后面请结合票型继续盘，不要只看表面。",
    "我这边能说的不多了，后面重点看谁在借机甩锅。",
]
HUMAN_SPEECH_LIMIT_SECONDS = 120.0
BOT_SPEECH_LIMIT_SECONDS = 7.2
WOLF_DISCUSSION_LIMIT_SECONDS = 30.0
DAY_VOTE_LIMIT_SECONDS = 20.0
DISCONNECT_GRACE_SECONDS = 30.0
NIGHT_SKILL_LIMIT_SECONDS = 20.0
WOLF_VOTE_LIMIT_SECONDS = 30.0
DEATH_SKILL_LIMIT_SECONDS = 20.0
SKILL_TIMEOUT_LIMITS = {
    "night_guard": NIGHT_SKILL_LIMIT_SECONDS,
    "night_wolves": WOLF_VOTE_LIMIT_SECONDS,
    "night_seer": NIGHT_SKILL_LIMIT_SECONDS,
    "night_witch": NIGHT_SKILL_LIMIT_SECONDS,
    "night_hunter": DEATH_SKILL_LIMIT_SECONDS,
    "day_hunter": DEATH_SKILL_LIMIT_SECONDS,
    "day_white_wolf_king": DEATH_SKILL_LIMIT_SECONDS,
}
NETWORK_PROBE_ID_PATTERN = re.compile(r"[A-Za-z0-9_-]{1,64}")


def json_message(message_type: str, **payload: Any) -> str:
    return json.dumps({"type": message_type, **payload}, ensure_ascii=False)


def validated_voice_volume(value: Any) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError("语音音量必须是有限数字。")
    return max(0.0, min(1.0, float(value)))


_send_locks: dict[int, asyncio.Lock] = {}


def ws_send_lock(ws: web.WebSocketResponse) -> asyncio.Lock:
    """每个 WebSocket 一把发送锁：aiohttp 的 send_str 不允许并发写同一连接。"""
    key = id(ws)
    lock = _send_locks.get(key)
    if lock is None:
        lock = asyncio.Lock()
        _send_locks[key] = lock
    return lock


def forget_ws_send_lock(ws: web.WebSocketResponse) -> None:
    _send_locks.pop(id(ws), None)


async def send(ws: web.WebSocketResponse, message_type: str, **payload: Any) -> None:
    if ws.closed:
        return
    try:
        # 定时器广播与消息处理广播可能并发写同一连接，串行化避免 aiohttp 抛错丢消息。
        async with ws_send_lock(ws):
            await ws.send_str(json_message(message_type, **payload))
    except Exception:
        # 对端正在关闭（半开连接）时 send_str 会抛异常。忽略单次发送失败，
        # 避免一次广播把整个消息处理链路拖垮、误踢其他玩家。
        pass


async def send_error(ws: web.WebSocketResponse, message: str) -> None:
    await send(ws, "error", message=message)


async def handle_network_ping(ws: web.WebSocketResponse, probe_id: Any) -> None:
    """Echo a small client nonce for a private application-level RTT measurement."""
    if not isinstance(probe_id, str) or not NETWORK_PROBE_ID_PATTERN.fullmatch(probe_id):
        raise ValueError("网络探测标识无效。")
    await send(ws, "network_pong", probeId=probe_id)


def make_room_code() -> str:
    while True:
        code = "".join(secrets.choice(ROOM_CODE_ALPHABET) for _ in range(6))
        if code not in rooms:
            return code


def detect_lan_ip() -> str:
    probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        probe.connect(("8.8.8.8", 80))
        return probe.getsockname()[0]
    except OSError:
        try:
            return socket.gethostbyname(socket.gethostname())
        except OSError:
            return "127.0.0.1"
    finally:
        probe.close()


def request_origin(request: web.Request) -> str:
    settings = request.app.get(NETWORK_SETTINGS_KEY, NetworkSettings())
    if settings.public_origin:
        return settings.public_origin
    # Proxy headers are user-controlled unless an explicitly configured proxy validates them.
    scheme = request.scheme
    host = request.host
    is_loopback = host.lower() in {"127.0.0.1", "localhost", "[::1]"} or host.lower().startswith(("127.0.0.1:", "localhost:", "[::1]:"))
    if is_loopback:
        request_url = getattr(request, "url", None)
        port = getattr(request_url, "port", None)
        if port is None:
            possible_port = host.rsplit(":", 1)[-1]
            port = int(possible_port) if possible_port.isdigit() else None
        return f"{scheme}://{detect_lan_ip()}:{port}" if port else f"{scheme}://{detect_lan_ip()}"
    return f"{scheme}://{host}"


def get_connected_room(ws: web.WebSocketResponse) -> tuple[ConnectedRoom | None, PlayerState | None]:
    room_ref = player_room_index.get(ws)
    if not room_ref:
        return None, None

    room_code, player_id = room_ref
    session = rooms.get(room_code)
    if not session:
        return None, None
    return session, session.room.players.get(player_id)


def human_players(room: RoomState) -> list[PlayerState]:
    return [player for player in room.players.values() if not player.is_bot]


def bot_players(room: RoomState) -> list[PlayerState]:
    return [player for player in room.players.values() if player.is_bot]


def connected_human_players(session: ConnectedRoom) -> list[PlayerState]:
    return [room_player for room_player in human_players(session.room) if room_player.player_id in session.sockets]


def next_host_player_id(room: RoomState) -> str:
    human_players_in_order = [player for player in room.players.values() if not player.is_bot]
    for player in human_players_in_order:
        if player.connected:
            return player.player_id
    if human_players_in_order:
        return human_players_in_order[0].player_id
    return next(iter(room.players.keys()))


def required_player_count(room: RoomState) -> int:
    return len(ROLE_PRESETS[room.config_preset])


def cancel_bot_task(session: ConnectedRoom) -> None:
    if session.bot_task and not session.bot_task.done():
        session.bot_task.cancel()
    session.bot_task = None


def cancel_speech_task(session: ConnectedRoom) -> None:
    if session.speech_task and not session.speech_task.done():
        session.speech_task.cancel()
    session.speech_task = None
    session.speech_deadline = None
    session.speech_actor_id = None
    session.speech_phase = None


def cancel_vote_task(session: ConnectedRoom) -> None:
    if session.vote_task and not session.vote_task.done():
        session.vote_task.cancel()
    session.vote_task = None
    session.vote_deadline = None
    session.vote_round = None


def cancel_wolf_discussion_task(session: ConnectedRoom) -> None:
    if session.wolf_discussion_task and session.wolf_discussion_task is not asyncio.current_task() and not session.wolf_discussion_task.done():
        session.wolf_discussion_task.cancel()
    session.wolf_discussion_task = None
    session.wolf_discussion_deadline = None


async def wolf_discussion_timeout_loop(session: ConnectedRoom) -> None:
    current_task = asyncio.current_task()
    try:
        await asyncio.sleep(WOLF_DISCUSSION_LIMIT_SECONDS)
        if rooms.get(session.room.code) is session and session.room.phase == "night_wolf_discussion":
            finish_wolf_discussion(session.room)
            await broadcast_room_state(session)
            schedule_bot_progress(session)
    except asyncio.CancelledError:
        raise
    finally:
        if session.wolf_discussion_task is current_task:
            session.wolf_discussion_task = None


def sync_wolf_discussion_timer(session: ConnectedRoom) -> None:
    if session.room.phase != "night_wolf_discussion" or not session.room.started:
        cancel_wolf_discussion_task(session)
        return
    if session.wolf_discussion_task and not session.wolf_discussion_task.done():
        return
    session.wolf_discussion_deadline = time.time() + WOLF_DISCUSSION_LIMIT_SECONDS
    session.wolf_discussion_task = asyncio.create_task(wolf_discussion_timeout_loop(session))


def cancel_skill_task(session: ConnectedRoom) -> None:
    if session.skill_task and session.skill_task is not asyncio.current_task() and not session.skill_task.done():
        session.skill_task.cancel()
    session.skill_task = None
    session.skill_deadline = None
    session.skill_phase = None
    session.skill_actor_id = None


def apply_skill_timeout(room: RoomState, phase: str) -> None:
    """Resolve a timed-out night/death skill phase so an AFK player cannot stall the game."""
    spotlight_id = room.spotlight_id or ""
    actor = room.players.get(spotlight_id)

    if phase == "night_guard":
        if actor and actor.is_bot:
            return
        if actor:
            skip_guard(room, actor.player_id)
    elif phase == "night_wolves":
        missing = [wolf for wolf in wolves_in_room(room) if wolf.player_id not in room.night.wolf_votes]
        if missing:
            auto_abstain_wolf_votes(room)
    elif phase == "night_seer":
        if actor and actor.is_bot:
            return
        if actor:
            skip_seer(room, actor.player_id)
    elif phase == "night_witch":
        if actor and actor.is_bot:
            return
        if actor:
            skip_witch(room, actor.player_id)
    elif phase in {"night_hunter", "day_hunter"}:
        if actor and actor.is_bot:
            return
        if actor:
            skip_hunter_shot(room, actor.player_id)
    elif phase == "day_white_wolf_king":
        if actor and actor.is_bot:
            return
        if actor:
            skip_white_wolf_king_blast(room, actor.player_id)


async def skill_timeout_loop(session: ConnectedRoom, *, phase: str, duration: float) -> None:
    current_task = asyncio.current_task()
    try:
        await asyncio.sleep(duration)
        if rooms.get(session.room.code) is not session:
            return
        room = session.room
        if room.phase != phase or not room.started:
            return

        apply_skill_timeout(room, phase)
        await broadcast_room_state(session)
        schedule_bot_progress(session)
    except asyncio.CancelledError:
        raise
    finally:
        if session.skill_task is current_task:
            session.skill_task = None
            session.skill_deadline = None
            session.skill_phase = None
            session.skill_actor_id = None


def sync_skill_timer(session: ConnectedRoom) -> None:
    room = session.room
    limit = SKILL_TIMEOUT_LIMITS.get(room.phase) if room.started else None
    if not limit:
        cancel_skill_task(session)
        return

    same_phase = (
        session.skill_task
        and not session.skill_task.done()
        and session.skill_phase == room.phase
        and session.skill_actor_id == room.spotlight_id
    )
    if same_phase:
        return

    cancel_skill_task(session)
    session.skill_phase = room.phase
    session.skill_actor_id = room.spotlight_id
    session.skill_deadline = time.time() + limit
    session.skill_task = asyncio.create_task(skill_timeout_loop(session, phase=room.phase, duration=limit))


def cancel_disconnect_task(session: ConnectedRoom, player_id: str) -> None:
    task = session.disconnect_tasks.pop(player_id, None)
    if task and not task.done():
        task.cancel()


def cancel_all_disconnect_tasks(session: ConnectedRoom) -> None:
    for player_id in list(session.disconnect_tasks.keys()):
        cancel_disconnect_task(session, player_id)


def make_bot_name(room: RoomState) -> str:
    used_names = {player.name for player in room.players.values()}
    for base_name in BOT_NAME_POOL:
        if base_name not in used_names:
            return base_name

    index = 1
    while True:
        candidate = f"机器人{index}"
        if candidate not in used_names:
            return candidate
        index += 1


def add_bots_to_room(session: ConnectedRoom, target_count: int) -> int:
    room = session.room
    if room.started:
        raise ValueError("游戏开始后不能再补充机器人。")

    created = 0
    while len(room.players) < target_count:
        bot = create_player(make_bot_name(room), claim_next_join_order(room), is_bot=True)
        room.players[bot.player_id] = bot
        created += 1
    refresh_player_numbers(room)
    refresh_voice_policy(room)
    return created


def choose_random_target(
    room: RoomState,
    *,
    actor_id: str,
    allow_none: bool = False,
    prefer_non_wolf: bool = False,
) -> str | None:
    candidates = [
        player.player_id
        for player in room.players.values()
        if player.alive and player.player_id != actor_id
    ]
    if prefer_non_wolf:
        preferred = [
            candidate_id
            for candidate_id in candidates
            if player_team(room.players[candidate_id]) != "wolf"
        ]
        if preferred:
            candidates = preferred
    if not candidates:
        return None if allow_none else actor_id
    if allow_none and random.random() < 0.12:
        return None
    return random.choice(candidates)


def bot_inspections(player: PlayerState) -> list[dict[str, str]]:
    inspections = player.bot_memory.get("inspections", [])
    return inspections if isinstance(inspections, list) else []


def remember_bot_inspection(
    room: RoomState,
    seer: PlayerState,
    target_id: str,
) -> None:
    target = room.players[target_id]
    inspections = [
        note
        for note in bot_inspections(seer)
        if note.get("targetId") != target_id
    ]
    inspections.append(
        {
            "targetId": target_id,
            "result": "狼人阵营" if player_team(target) == "wolf" else "好人阵营",
        }
    )
    seer.bot_memory["inspections"] = inspections


def ranked_bot_targets(
    room: RoomState,
    actor: PlayerState,
    *,
    exclude_wolves: bool = False,
    exclude_ids: set[str] | None = None,
) -> list[str]:
    excluded = exclude_ids or set()
    candidates = [
        player
        for player in room.players.values()
        if player.alive
        and player.player_id != actor.player_id
        and player.player_id not in excluded
        and (not exclude_wolves or player_team(player) != "wolf")
    ]
    if not candidates:
        return []

    current_votes: dict[str, int] = {}
    for target_id in room.day.votes.values():
        if target_id:
            current_votes[target_id] = current_votes.get(target_id, 0) + 1

    inspected = {note.get("targetId"): note.get("result") for note in bot_inspections(actor)}

    def score(target: PlayerState) -> tuple[float, int, str]:
        # Current public votes are the strongest publicly visible signal. The small,
        # deterministic tiebreaker keeps a bot's stance coherent within one round.
        value = current_votes.get(target.player_id, 0) * 2.0
        if inspected.get(target.player_id) == "狼人阵营":
            value += 100.0
        elif inspected.get(target.player_id) == "好人阵营":
            value -= 100.0
        value += ((target.player_number * 13 + actor.player_number * 7 + room.round_number * 5) % 11) / 20
        return (-value, target.player_number, target.player_id)

    return [player.player_id for player in sorted(candidates, key=score)]


def choose_bot_vote_target(room: RoomState, bot: PlayerState) -> str | None:
    candidates = ranked_bot_targets(
        room,
        bot,
        exclude_wolves=player_team(bot) == "wolf",
    )
    if not candidates:
        return None

    # Good bots will occasionally abstain when no public vote has formed; wolves
    # still commit to a target so their night action cannot stall.
    has_public_case = any(target_id is not None for target_id in room.day.votes.values())
    if player_team(bot) != "wolf" and not has_public_case and random.random() < 0.12:
        return None
    return candidates[0]


def normalize_session_token(raw_value: Any) -> str:
    token = str(raw_value or "").strip()
    return token[:128] if token else secrets.token_hex(16)


def player_by_session_token(room: RoomState, session_token: str) -> PlayerState | None:
    if not session_token:
        return None
    matches = [p for p in room.players.values() if not p.is_bot and p.session_token == session_token]
    # 即便遇到旧的歧义数据，也不能随机恢复到第一个人的身份。
    return matches[0] if len(matches) == 1 else None


def current_timed_speaker(room: RoomState) -> str | None:
    if room.phase == "day_discussion":
        return current_day_speaker(room)
    if room.phase == "day_last_words":
        return current_last_words_speaker(room)
    return None


def speech_limit_seconds(player: PlayerState) -> float:
    return BOT_SPEECH_LIMIT_SECONDS if player.is_bot else HUMAN_SPEECH_LIMIT_SECONDS


def update_bot_speaking_state(room: RoomState, active_bot_id: str | None) -> None:
    for player in room.players.values():
        if not player.is_bot:
            continue
        player.voice_speaking = player.player_id == active_bot_id
        player.voice_volume = 0.74 if player.player_id == active_bot_id else 0.0


def _legacy_bot_speech_line(room: RoomState, actor: PlayerState) -> str:
    if room.phase == "day_last_words":
        summary = room.last_vote_summary or {}
        ranking = summary.get("voteRanking", [])
        if ranking:
            leader = ranking[0]
            return (
                f"我的遗言留给好人：上一轮 {leader['targetDisplayName']} 收到 "
                f"{leader['votes']} 票，后续请把这条票型和每个人的理由一起看。"
            )
        return random.choice(BOT_LAST_WORD_LINES)

    inspections = bot_inspections(actor)
    wolf_checks = [
        note
        for note in inspections
        if (target := room.players.get(note.get("targetId", ""))) and player_team(target) == "wolf"
    ]
    good_checks = [
        note
        for note in inspections
        if (target := room.players.get(note.get("targetId", ""))) and player_team(target) != "wolf"
    ]
    if actor.role == "seer" and wolf_checks:
        target = room.players.get(wolf_checks[-1].get("targetId", ""))
        if target:
            return f"我给出明确信息：昨晚查验 {player_display_name(room, target)}，结果是狼人阵营。今天请优先处理。"
    if actor.role == "seer" and good_checks and random.random() < 0.7:
        target = room.players.get(good_checks[-1].get("targetId", ""))
        if target:
            return f"我有一条已验证的好人信息：{player_display_name(room, target)} 昨晚是好人阵营，建议先把他放出焦点。"

    hints: list[str] = []
    summary = room.last_vote_summary or {}
    ranking = summary.get("voteRanking", [])
    if ranking:
        leader = ranking[0]
        hints.append(
            f"上一轮 {leader['targetDisplayName']} 收到 {leader['votes']} 票。"
            "我会把票型和投票理由分开看，不会只跟着结果走。"
        )
    if room.day.public_deaths:
        recent = room.players.get(room.day.public_deaths[0])
        if recent:
            hints.append(f"昨晚 {player_display_name(room, recent)} 出局后，场上的站队变化值得重新核对。")
    suspects = ranked_bot_targets(room, actor, exclude_wolves=player_team(actor) == "wolf")
    if suspects:
        suspect = room.players[suspects[0]]
        hints.append(
            f"我目前会优先听 {player_display_name(room, suspect)} 的解释。"
            "如果他的发言和后续票型对不上，我会把这一点作为今天的主线。"
        )
    hints.extend(BOT_DISCUSSION_LINES)
    speech_turn = int(actor.bot_memory.get("discussionSpeechTurn", 0)) + 1
    actor.bot_memory["discussionSpeechTurn"] = speech_turn
    primary = random.choice(hints)
    follow_ups = [
        "我会把每个人对这个判断的反应记下来，临近投票时再和票型核对。",
        "现在不急着锁死身份，但请被点到的人给出完整的行动逻辑，不要只报身份。",
        "如果后位有人能补充更硬的信息，我会调整优先级；没有的话就按这条线推进。",
        "我这一轮会先站这条逻辑，投票前也会看有没有人突然改口或只跟票不解释。",
    ]
    if suspects:
        suspect_name = player_display_name(room, room.players[suspects[0]])
        follow_ups.append(
            f"目前我会把 {suspect_name} 放在前置观察位，除非他能解释清楚前后站边的变化。"
        )
    if player_team(actor) == "wolf":
        follow_ups.append("我不建议把票分散到太多位置，先围绕最有争议的一到两位形成可验证的票型。")
    return f"第 {speech_turn} 点：{primary} {random.choice(follow_ups)}"


def bot_memory_choice(actor: PlayerState, key: str, choices: list[str]) -> str:
    """Choose a talking point the bot has not used recently in this match."""
    history_key = f"speechHistory:{key}"
    history = actor.bot_memory.get(history_key, [])
    if not isinstance(history, list):
        history = []
    recent = set(history[-max(1, len(choices) - 1):])
    available = [choice for choice in choices if choice not in recent] or choices
    selected = random.choice(available)
    actor.bot_memory[history_key] = (history + [selected])[-12:]
    return selected


def bot_speech_line(room: RoomState, actor: PlayerState) -> str:
    """Create a varied, evidence-led discussion statement for an AI player."""
    if room.phase == "day_last_words":
        summary = room.last_vote_summary or {}
        ranking = summary.get("voteRanking", [])
        if ranking:
            leader = ranking[0]
            return (
                f"遗言留给好人：上一轮 {leader['targetDisplayName']} 收到 {leader['votes']} 票。"
                "请把投票先后、改票的人和他们当时的理由一起复盘，不要只记最后结果。"
            )
        return bot_memory_choice(actor, "lastWords", BOT_LAST_WORD_LINES)

    speech_turn = int(actor.bot_memory.get("discussionSpeechTurn", 0)) + 1
    actor.bot_memory["discussionSpeechTurn"] = speech_turn
    openings = [
        "我先给结论，再说依据。",
        "这一轮我不空保人，先把能验证的线索摆出来。",
        "我目前的站边是暂定的，后位有硬信息可以直接推翻我。",
        "我先拆开看身份信息和票型，别把两件事混在一起。",
    ]

    points: list[str] = []
    hard_points: list[str] = []
    inspections = bot_inspections(actor)
    announced = actor.bot_memory.get("announcedInspectionIds", [])
    announced_ids = set(announced) if isinstance(announced, list) else set()
    wolf_checks = [note for note in inspections if note.get("result") == "狼人阵营"]
    good_checks = [note for note in inspections if note.get("result") == "好人阵营"]
    fresh_wolf_checks = [note for note in wolf_checks if note.get("targetId") not in announced_ids]
    fresh_good_checks = [note for note in good_checks if note.get("targetId") not in announced_ids]
    report = fresh_wolf_checks[-1:] or fresh_good_checks[-1:]
    if actor.role == "seer" and report:
        note = report[0]
        target = room.players.get(note.get("targetId", ""))
        if target:
            announced_ids.add(target.player_id)
            actor.bot_memory["announcedInspectionIds"] = list(announced_ids)
            hard_points.append(
                f"我报一条未公开验人：{player_display_name(room, target)} 是{note['result']}，"
                "这条信息请先作为今天站边的硬锚点。"
            )
    elif actor.role == "seer" and wolf_checks:
        target = room.players.get(wolf_checks[-1].get("targetId", ""))
        if target:
            hard_points.append(
                f"我之前已经报过 {player_display_name(room, target)} 的狼人结果，"
                "今天重点看谁在回避这条信息或刻意分票。"
            )

    summary = room.last_vote_summary or {}
    ranking = summary.get("voteRanking", [])
    if ranking:
        leader = ranking[0]
        points.append(
            f"上一轮 {leader['targetDisplayName']} 有 {leader['votes']} 票，"
            "我会重点核对领票位的发言，以及临近投票才改口的人。"
        )
    if room.day.public_deaths:
        recent = room.players.get(room.day.public_deaths[0])
        if recent:
            points.append(
                f"昨夜 {player_display_name(room, recent)} 出局后，原来的站边关系需要重算，"
                "尤其是他最后怀疑或保护过的人。"
            )

    suspects = ranked_bot_targets(room, actor, exclude_wolves=player_team(actor) == "wolf")
    if suspects:
        suspect = room.players[suspects[0]]
        points.append(
            f"我现在优先听 {player_display_name(room, suspect)} 解释，"
            "请把你的怀疑链、投票目标和后位变化一次说完整。"
        )
    points.extend([
        "没有硬信息时，最有价值的是谁的判断前后矛盾，而不是谁说得最凶。",
        "我不建议现在把票打散；先形成两三个可比较的焦点，再看谁在无理由跟票。",
        "身份可以暂不交，但站边必须交：你认为今天最不能放的人是谁，理由是什么。",
        "后位如果只复述前位结论、不补自己的逻辑，我会把这当作减分项。",
    ])

    primary = hard_points[-1] if hard_points else bot_memory_choice(actor, "primary", points)
    secondary_pool = [point for point in points if point != primary]
    secondary = bot_memory_choice(actor, "secondary", secondary_pool)
    close = bot_memory_choice(actor, "close", [
        "投票前我会按这条线复盘一次，有更硬的信息我会改票。",
        "先把结论留在这里，等后位回应后我会明确给出票点。",
        "我不锁死任何人，但请大家把自己的票和理由绑定，不要临场跳票。",
    ])
    return f"第 {speech_turn} 点：{bot_memory_choice(actor, 'opening', openings)} {primary} {secondary} {close}"


def sync_speech_timer(session: ConnectedRoom) -> None:
    room = session.room
    actor_id = current_timed_speaker(room)
    if not actor_id or actor_id not in room.players:
        update_bot_speaking_state(room, None)
        cancel_speech_task(session)
        refresh_voice_policy(room)
        return

    actor = room.players[actor_id]
    update_bot_speaking_state(room, actor_id if actor.is_bot else None)
    refresh_voice_policy(room)

    same_turn = (
        session.speech_task
        and not session.speech_task.done()
        and session.speech_actor_id == actor_id
        and session.speech_phase == room.phase
    )
    if same_turn:
        return

    cancel_speech_task(session)
    session.speech_actor_id = actor_id
    session.speech_phase = room.phase
    session.speech_deadline = time.time() + speech_limit_seconds(actor)
    if actor.is_bot:
        if room.phase == "day_last_words":
            add_notice(room, f"{player_display_name(room, actor)} 的遗言：{bot_speech_line(room, actor)}")
        else:
            add_notice(room, f"{player_display_name(room, actor)} 发言：{bot_speech_line(room, actor)}")
    session.speech_task = asyncio.create_task(
        speech_timeout_loop(
            session,
            actor_id=actor_id,
            phase=room.phase,
            duration=speech_limit_seconds(actor),
        )
    )


def sync_vote_timer(session: ConnectedRoom) -> None:
    room = session.room
    if room.phase != "day_vote" or not room.started:
        cancel_vote_task(session)
        return

    same_round = (
        session.vote_task
        and not session.vote_task.done()
        and session.vote_round == room.round_number
    )
    if same_round:
        return

    cancel_vote_task(session)
    session.vote_round = room.round_number
    session.vote_deadline = time.time() + DAY_VOTE_LIMIT_SECONDS
    session.vote_task = asyncio.create_task(
        vote_timeout_loop(
            session,
            round_number=room.round_number,
            duration=DAY_VOTE_LIMIT_SECONDS,
        )
    )


async def speech_timeout_loop(
    session: ConnectedRoom,
    *,
    actor_id: str,
    phase: str,
    duration: float,
) -> None:
    current_task = asyncio.current_task()
    try:
        await asyncio.sleep(duration)
        if rooms.get(session.room.code) is not session:
            return
        if actor_id not in session.room.players or session.room.phase != phase or session.room.spotlight_id != actor_id:
            return

        actor = session.room.players[actor_id]
        session.speech_task = None
        session.speech_deadline = None
        session.speech_actor_id = None
        session.speech_phase = None
        update_bot_speaking_state(session.room, None)

        if phase == "day_last_words":
            add_notice(session.room, f"{player_display_name(session.room, actor)} 的遗言时间已到，系统自动切换。")
            advance_last_words(session.room, actor_id)
        elif phase == "day_discussion":
            add_notice(session.room, f"{player_display_name(session.room, actor)} 的发言时间已到，系统自动切换。")
            advance_discussion(session.room, actor_id, forced_by_host=True)
        else:
            return

        await broadcast_room_state(session)
        schedule_bot_progress(session)
    except asyncio.CancelledError:
        raise
    finally:
        if session.speech_task is current_task:
            session.speech_task = None


async def vote_timeout_loop(
    session: ConnectedRoom,
    *,
    round_number: int,
    duration: float,
) -> None:
    current_task = asyncio.current_task()
    try:
        await asyncio.sleep(duration)
        if rooms.get(session.room.code) is not session:
            return
        if session.room.phase != "day_vote" or session.room.round_number != round_number:
            return

        missing = fill_missing_votes_as_abstain(session.room, submitted_at=time.time())
        if missing:
            add_notice(session.room, f"公投时间结束，{missing} 名未投票玩家已按弃票处理。")
        else:
            add_notice(session.room, "公投时间结束，系统开始结算投票结果。")
        session.vote_task = None
        session.vote_deadline = None
        session.vote_round = None
        finalize_vote(session.room)
        await broadcast_room_state(session)
        schedule_bot_progress(session)
    except asyncio.CancelledError:
        raise
    finally:
        if session.vote_task is current_task:
            session.vote_task = None


async def finalize_player_departure(
    session: ConnectedRoom,
    player_id: str,
    *,
    notice_message: str | None,
) -> ConnectedRoom | None:
    player = session.room.players.get(player_id)
    if not player:
        return rooms.get(session.room.code)

    was_host = player.player_id == session.room.host_id
    cancel_disconnect_task(session, player_id)
    session.sockets.pop(player_id, None)
    remove_player_from_room(session.room, player_id)

    if not human_players(session.room):
        cancel_bot_task(session)
        cancel_speech_task(session)
        cancel_vote_task(session)
        cancel_skill_task(session)
        cancel_all_disconnect_tasks(session)
        rooms.pop(session.room.code, None)
        return None

    if was_host and session.room.players:
        session.room.host_id = next_host_player_id(session.room)
        add_notice(session.room, f"房主已离开，{player_display_name(session.room, session.room.host_id)} 成为新房主。")

    if notice_message:
        add_notice(session.room, notice_message)
    return session


async def disconnect_timeout_loop(session: ConnectedRoom, player_id: str) -> None:
    current_task = asyncio.current_task()
    try:
        await asyncio.sleep(DISCONNECT_GRACE_SECONDS)
        if rooms.get(session.room.code) is not session:
            return
        player = session.room.players.get(player_id)
        if not player or player.connected or player_id in session.sockets:
            return
        remaining_session = await finalize_player_departure(
            session,
            player_id,
            notice_message=f"{player_display_name(session.room, player)} 断线超时，已退出房间。",
        )
        if remaining_session:
            await broadcast_room_state(remaining_session)
            schedule_bot_progress(remaining_session)
    except asyncio.CancelledError:
        raise
    finally:
        if session.disconnect_tasks.get(player_id) is current_task:
            session.disconnect_tasks.pop(player_id, None)


def schedule_disconnect_timeout(session: ConnectedRoom, player_id: str) -> None:
    cancel_disconnect_task(session, player_id)
    session.disconnect_tasks[player_id] = asyncio.create_task(disconnect_timeout_loop(session, player_id))


async def execute_bot_step(session: ConnectedRoom) -> bool:
    room = session.room
    if room.phase in {"lobby", "ended"}:
        return False

    if room.phase == "night_guard":
        guard = next((player for player in room.players.values() if player.alive and player.role == "guard"), None)
        if not guard or not guard.is_bot or room.spotlight_id != guard.player_id:
            return False
        candidates = ranked_bot_targets(
            room,
            guard,
            exclude_ids={room.night.last_guard_target_id} if room.night.last_guard_target_id else set(),
        )
        if not candidates:
            return False
        submit_guard(room, guard.player_id, candidates[-1])
        return True

    if room.phase == "night_wolf_discussion":
        for wolf in wolves_in_room(room):
            if not wolf.is_bot or wolf.bot_memory.get("wolfChatRound") == room.round_number:
                continue
            targets = ranked_bot_targets(room, wolf, exclude_wolves=True)
            target = room.players.get(targets[0]) if targets else None
            suggestion = (
                f"我倾向先刀 {player_display_name(room, target)}，信息位或关键发言位收益更高。"
                if target else "我暂时没有更好的刀口，等队友给出建议。"
            )
            submit_wolf_chat(room, wolf.player_id, suggestion)
            wolf.bot_memory["wolfChatRound"] = room.round_number
            return True
        return False

    if room.phase == "night_wolves":
        living_wolves = wolves_in_room(room)
        missing_bots = [
            wolf for wolf in living_wolves if wolf.is_bot and wolf.player_id not in room.night.wolf_votes
        ]
        if not missing_bots:
            return False
        selected_target = next(
            (target_id for target_id in room.night.wolf_votes.values() if target_id is not None),
            None,
        )
        for wolf in missing_bots:
            if selected_target is None:
                ranked_targets = ranked_bot_targets(room, wolf, exclude_wolves=True)
                selected_target = ranked_targets[0] if ranked_targets else None
            submit_wolf_vote(
                room,
                wolf.player_id,
                selected_target,
            )
        return True

    if room.phase == "night_seer":
        seer = next((player for player in room.players.values() if player.alive and player.role == "seer"), None)
        if not seer or not seer.is_bot or room.spotlight_id != seer.player_id:
            return False
        inspected_ids = {note.get("targetId") for note in bot_inspections(seer)}
        candidates = ranked_bot_targets(room, seer, exclude_ids=inspected_ids)
        target_id = candidates[0] if candidates else choose_random_target(room, actor_id=seer.player_id)
        if not target_id:
            return False
        submit_seer(room, seer.player_id, target_id)
        remember_bot_inspection(room, seer, target_id)
        return True

    if room.phase == "night_witch":
        witch = next((player for player in room.players.values() if player.alive and player.role == "witch"), None)
        if not witch or not witch.is_bot or room.spotlight_id != witch.player_id:
            return False
        save = bool(room.night.attacked_player_id) and not witch.witch_antidote_used and random.random() < 0.82
        poison_target_id = None
        if not save and not witch.witch_poison_used and room.round_number >= 2 and random.random() < 0.22:
            candidates = ranked_bot_targets(room, witch)
            poison_target_id = candidates[0] if candidates else None
        submit_witch(room, witch.player_id, save=save, poison_target_id=poison_target_id)
        return True

    if room.phase == "day_last_words":
        return False

    if room.phase == "day_discussion":
        actor_id = room.spotlight_id
        actor = room.players.get(actor_id or "")
        if (
            actor
            and actor.is_bot
            and actor.alive
            and actor.role == "knight"
            and not actor.knight_duel_used
        ):
            suspects = ranked_bot_targets(room, actor)
            has_public_case = any(target_id is not None for target_id in room.day.votes.values())
            should_duel = has_public_case or room.round_number >= 2 or random.random() < 0.34
            if suspects and should_duel:
                perform_knight_duel(room, actor.player_id, suspects[0])
                return True
        return False

    if room.phase == "day_vote":
        missing_bots = [
            player
            for player in room.players.values()
            if player.alive and player.is_bot and player.player_id not in room.day.votes
        ]
        if not missing_bots:
            return False
        for bot in missing_bots:
            submit_vote(
                room,
                bot.player_id,
                choose_bot_vote_target(room, bot),
                submitted_at=time.time(),
            )
        return True

    if room.phase in {"night_hunter", "day_hunter"}:
        actor_id = room.spotlight_id
        if not actor_id or not room.players[actor_id].is_bot:
            return False
        target_id = choose_random_target(
            room,
            actor_id=actor_id,
            allow_none=True,
            prefer_non_wolf=player_team(room.players[actor_id]) == "wolf",
        )
        if target_id is None:
            skip_hunter_shot(room, actor_id)
        else:
            perform_hunter_shot(room, actor_id, target_id)
        return True

    if room.phase == "day_white_wolf_king":
        actor_id = room.spotlight_id
        if not actor_id or not room.players[actor_id].is_bot:
            return False
        target_id = choose_random_target(room, actor_id=actor_id, prefer_non_wolf=True)
        if not target_id:
            return False
        perform_white_wolf_king_blast(room, actor_id, target_id)
        return True

    return False


async def bot_progress_loop(session: ConnectedRoom, *, delay: float) -> None:
    current_task = asyncio.current_task()
    try:
        while rooms.get(session.room.code) is session and connected_human_players(session):
            progressed = await execute_bot_step(session)
            if not progressed:
                return
            await broadcast_room_state(session)
            await asyncio.sleep(delay + random.uniform(0.05, 0.25))
    except asyncio.CancelledError:
        raise
    finally:
        if session.bot_task is current_task:
            session.bot_task = None


def schedule_bot_progress(session: ConnectedRoom, *, delay: float = 0.45) -> None:
    if session.room.phase in {"lobby", "ended"} or not session.room.started or not connected_human_players(session):
        return
    if session.bot_task and not session.bot_task.done():
        return
    session.bot_task = asyncio.create_task(bot_progress_loop(session, delay=delay))


def ensure_room_url_bundle(session: ConnectedRoom) -> dict[str, Any]:
    origin = session.server_origin or f"http://{detect_lan_ip()}:8080"
    room_code = session.room.code
    join_url = f"{origin}/?join={room_code}"
    qr_url = f"{origin}/api/rooms/{room_code}/qr.svg"
    return {
        "origin": origin,
        "joinUrl": join_url,
        "qrUrl": qr_url,
        "discoveryUrl": f"{origin}/api/rooms",
        "lanHost": origin.split("://", 1)[-1],
    }


def build_qr_text(session: ConnectedRoom) -> str:
    urls = ensure_room_url_bundle(session)
    # QR scanners recognize a raw URL and open it immediately. Encoding room
    # metadata as JSON makes many phone camera apps show text instead of a link.
    return urls["joinUrl"]


def build_room_state_payload(session: ConnectedRoom, viewer_id: str) -> dict[str, Any]:
    refresh_player_numbers(session.room)
    payload = room_payload(session.room, viewer_id)
    payload["sessionToken"] = session.room.players[viewer_id].session_token
    # Deliver relay credentials only to an admitted room participant, never a public catalog.
    payload["rtcConfiguration"] = session.network_settings.rtc_configuration()
    payload["roomAccess"] = {
        **ensure_room_url_bundle(session),
        "qrPayload": build_qr_text(session),
    }
    payload["speechTimer"] = (
        {
            "actorId": session.speech_actor_id,
            "phase": session.speech_phase,
            "endsAt": session.speech_deadline,
            "limitSeconds": int(
                speech_limit_seconds(session.room.players[session.speech_actor_id])
            ),
        }
        if session.speech_actor_id and session.speech_deadline and session.speech_actor_id in session.room.players
        else None
    )
    payload["voteTimer"] = (
        {
            "phase": "day_vote",
            "endsAt": session.vote_deadline,
            "limitSeconds": int(DAY_VOTE_LIMIT_SECONDS),
            "submittedCount": len(session.room.day.votes),
            "eligibleVoterCount": sum(1 for player in session.room.players.values() if player.alive),
        }
        if session.room.phase == "day_vote" and session.vote_deadline
        else None
    )
    payload["wolfDiscussionTimer"] = (
        {"endsAt": session.wolf_discussion_deadline, "limitSeconds": int(WOLF_DISCUSSION_LIMIT_SECONDS)}
        if session.room.phase == "night_wolf_discussion" and session.wolf_discussion_deadline
        else None
    )
    payload["skillTimer"] = (
        {
            "phase": session.skill_phase,
            "actorId": payload["spotlightId"],
            "endsAt": session.skill_deadline,
            "limitSeconds": int(SKILL_TIMEOUT_LIMITS[session.skill_phase]),
        }
        if session.room.phase in SKILL_TIMEOUT_LIMITS and session.skill_phase and session.skill_deadline
        else None
    )
    return payload


async def broadcast_room_state(session: ConnectedRoom) -> None:
    sync_speech_timer(session)
    sync_vote_timer(session)
    sync_wolf_discussion_timer(session)
    sync_skill_timer(session)
    refresh_voice_policy(session.room)
    for player_id, ws in list(session.sockets.items()):
        if ws.closed:
            continue
        if player_id not in session.room.players:
            continue
        await send(ws, "room_state", **build_room_state_payload(session, player_id))


async def push_notice(session: ConnectedRoom, message: str) -> None:
    add_notice(session.room, message)
    for ws in list(session.sockets.values()):
        await send(ws, "notice", message=message)
    await broadcast_room_state(session)


def create_player(name: str, joined_order: int, *, is_bot: bool = False) -> PlayerState:
    return PlayerState(
        player_id=secrets.token_hex(4),
        name=name[:20] or "玩家",
        is_bot=is_bot,
        session_token="" if is_bot else secrets.token_hex(16),
        connected=True,
        joined_order=joined_order,
    )


async def create_room(
    request: web.Request,
    ws: web.WebSocketResponse,
    *,
    name: str,
    preset: str,
    allow_self_destruct: bool,
    enable_ai_mode: bool,
    session_token: str,
) -> None:
    if preset not in ROLE_PRESETS:
        await send_error(ws, "未知的身份板子配置。")
        return

    code = make_room_code()
    player = create_player(name or "房主", 1)
    player.session_token = normalize_session_token(session_token)
    player.connected = True
    room = RoomState(code=code, host_id=player.player_id, players={player.player_id: player}, next_join_order=2)
    update_room_config(room, preset=preset, allow_self_destruct=allow_self_destruct)
    update_ai_mode(room, enable_ai_mode=enable_ai_mode)
    session = ConnectedRoom(room=room, sockets={player.player_id: ws}, server_origin=request_origin(request),
                            network_settings=request.app.get(NETWORK_SETTINGS_KEY, NetworkSettings()))
    rooms[code] = session
    player_room_index[ws] = (code, player.player_id)
    refresh_voice_policy(room)
    await push_notice(session, f"房间 {code} 已创建。当前板子：{PRESET_LABELS[preset]}。")


async def join_room(ws: web.WebSocketResponse, *, code: str, name: str, session_token: str) -> None:
    session = rooms.get(code)
    if not session:
        await send_error(ws, "房间不存在。")
        return

    room = session.room
    session_token = normalize_session_token(session_token)
    if any(not p.is_bot and p.session_token == session_token for p in room.players.values()):
        raise ValueError("此会话已在该房间占有席位，请刷新页面恢复原席位，不要重复加入。")
    required_players = len(ROLE_PRESETS[room.config_preset])
    if room.started:
        await send_error(ws, "该对局已经开始，暂不支持中途加入。")
        return
    if len(room.players) >= required_players:
        await send_error(ws, f"房间已满，本板子要求 {required_players} 人。")
        return

    player = create_player(name or "玩家", claim_next_join_order(room))
    player.session_token = normalize_session_token(session_token)
    player.connected = True
    room.players[player.player_id] = player
    session.sockets[player.player_id] = ws
    player_room_index[ws] = (room.code, player.player_id)
    refresh_voice_policy(room)
    await push_notice(session, f"{player_display_name(room, player)} 加入了房间。")


async def resume_session(
    request: web.Request,
    ws: web.WebSocketResponse,
    *,
    code: str,
    session_token: str,
) -> None:
    session = rooms.get(code)
    if not session:
        await send(ws, "resume_failed", message="原房间已不存在，无法恢复连接。")
        return

    player = player_by_session_token(session.room, normalize_session_token(session_token))
    if not player:
        await send(ws, "resume_failed", message="未找到可恢复的玩家身份。")
        return

    existing_ws = session.sockets.get(player.player_id)
    if existing_ws is ws:
        await send(ws, "resume_failed", message="当前连接已经在房间内。")
        return
    if existing_ws and existing_ws is not ws:
        # 旧连接可能仍处于半开状态（服务端尚未感知断线）。让新连接直接接管席位，
        # 并解绑旧 socket 的玩家索引，避免旧连接退出时的清理逻辑误伤新会话。
        player_room_index.pop(existing_ws, None)
        session.sockets.pop(player.player_id, None)
        forget_ws_send_lock(existing_ws)

    player.connected = True
    player.voice_speaking = False
    player.voice_volume = 0.0
    session.sockets[player.player_id] = ws
    player_room_index[ws] = (session.room.code, player.player_id)
    cancel_disconnect_task(session, player.player_id)
    # 在任何 await 前原子绑定新连接；主动接管与普通掉线使用不同关闭码。
    if existing_ws and not existing_ws.closed:
        await existing_ws.close(code=4001, message=b"session_replaced")
    if session.sockets.get(player.player_id) is not ws:
        return
    add_notice(session.room, f"{player_display_name(session.room, player)} 已重新连接。")
    await broadcast_room_state(session)
    schedule_bot_progress(session)


async def leave_room(ws: web.WebSocketResponse) -> ConnectedRoom | None:
    session, player = get_connected_room(ws)
    if not session or not player:
        return None

    if session.sockets.get(player.player_id) is not ws:
        # 过期连接：座位已被更新的连接接管，只清理自身索引。
        player_room_index.pop(ws, None)
        forget_ws_send_lock(ws)
        return None

    player_room_index.pop(ws, None)
    forget_ws_send_lock(ws)
    player.connected = False
    player.voice_speaking = False
    player.voice_volume = 0.0
    return await finalize_player_departure(
        session,
        player.player_id,
        notice_message=f"{player_display_name(session.room, player)} 离开了房间。",
    )


async def disconnect_room(ws: web.WebSocketResponse) -> ConnectedRoom | None:
    room_ref = player_room_index.get(ws)
    if not room_ref:
        return None

    room_code, player_id = room_ref
    session = rooms.get(room_code)
    player = session.room.players.get(player_id) if session else None
    if not session or not player:
        player_room_index.pop(ws, None)
        forget_ws_send_lock(ws)
        return None

    if session.sockets.get(player_id) is not ws:
        # 过期连接：座位已被更新的连接接管（例如重连接管），只清理自身索引。
        player_room_index.pop(ws, None)
        forget_ws_send_lock(ws)
        return None

    session.sockets.pop(player.player_id, None)
    player_room_index.pop(ws, None)
    forget_ws_send_lock(ws)
    player.connected = False
    player.voice_speaking = False
    player.voice_volume = 0.0
    refresh_voice_policy(session.room)
    add_notice(session.room, f"{player_display_name(session.room, player)} 连接中断，系统将保留席位 {int(DISCONNECT_GRACE_SECONDS)} 秒。")
    schedule_disconnect_timeout(session, player.player_id)
    await broadcast_room_state(session)
    return session


def require_host(session: ConnectedRoom, player: PlayerState) -> None:
    if player.player_id != session.room.host_id:
        raise ValueError("只有房主可以执行这个操作。")


async def start_match(session: ConnectedRoom, player: PlayerState) -> None:
    require_host(session, player)
    if session.room.started:
        raise ValueError("对局已经开始，不能重复开始或重置。")
    required_players = required_player_count(session.room)
    human_count = len(human_players(session.room))
    added = 0
    if session.room.enable_ai_mode and human_count >= 1 and len(session.room.players) < required_players:
        added = add_bots_to_room(session, required_players)
    if len(session.room.players) != required_players:
        raise ValueError(f"当前板子必须凑齐 {required_players} 人后才能开始。")
    start_game(session.room)
    message = "游戏开始，进入规则驱动流程。"
    if added:
        message = f"游戏开始，已自动补入 {added} 名机器人。"
    await push_notice(session, message)
    schedule_bot_progress(session, delay=2.2 if session.room.enable_ai_mode else 0.45)


async def update_config_message(
    session: ConnectedRoom,
    player: PlayerState,
    *,
    preset: str,
    allow_self_destruct: bool,
    enable_ai_mode: bool,
) -> None:
    require_host(session, player)
    update_room_config(session.room, preset=preset, allow_self_destruct=allow_self_destruct)
    update_ai_mode(session.room, enable_ai_mode=enable_ai_mode)
    await push_notice(
        session,
        "房间配置已更新："
        f"{PRESET_LABELS[preset]}，"
        f"自爆机制 {'开启' if allow_self_destruct else '关闭'}，"
        f"人机模式 {'开启' if enable_ai_mode else '关闭'}。",
    )


async def handle_game_action(
    session: ConnectedRoom,
    player: PlayerState,
    ws: web.WebSocketResponse,
    payload: dict[str, Any],
) -> None:
    action = str(payload.get("action", "")).strip()
    target_id = payload.get("targetId")
    target_id = str(target_id) if target_id else None
    message = ""

    if action == "guard":
        message = submit_guard(session.room, player.player_id, target_id or "")
    elif action == "wolf_vote":
        message = submit_wolf_vote(session.room, player.player_id, target_id)
    elif action == "seer":
        message = submit_seer(session.room, player.player_id, target_id or "")
    elif action == "witch":
        message = submit_witch(
            session.room,
            player.player_id,
            save=bool(payload.get("save")),
            poison_target_id=target_id,
        )
    elif action == "end_speech":
        advance_discussion(session.room, player.player_id)
        message = "已结束你的发言。"
    elif action == "end_last_words":
        advance_last_words(session.room, player.player_id)
        message = "已结束你的遗言。"
    elif action == "vote":
        message = submit_vote(session.room, player.player_id, target_id, submitted_at=time.time())
    elif action == "hunter_shot":
        if target_id:
            message = perform_hunter_shot(session.room, player.player_id, target_id)
        else:
            skip_hunter_shot(session.room, player.player_id)
            message = "你选择了不开枪。"
    elif action == "white_wolf_king_blast":
        message = perform_white_wolf_king_blast(session.room, player.player_id, target_id or "")
    elif action == "knight_duel":
        message = perform_knight_duel(session.room, player.player_id, target_id or "")
    elif action == "self_destruct":
        message = perform_self_destruct(session.room, player.player_id)
    else:
        raise ValueError("未知的游戏动作。")

    if message:
        await send(ws, "action_result", message=message)
    await broadcast_room_state(session)
    schedule_bot_progress(session)


async def handle_wolf_chat(session: ConnectedRoom, player: PlayerState, content: str) -> None:
    message = submit_wolf_chat(session.room, player.player_id, content)
    for wolf in wolves_in_room(session.room):
        ws = session.sockets.get(wolf.player_id)
        if ws:
            await send(ws, "wolf_chat", playerId=player.player_id, content=message)
    await broadcast_room_state(session)


async def force_next_speech(session: ConnectedRoom, player: PlayerState) -> None:
    require_host(session, player)
    room = session.room
    if room.phase == "day_discussion":
        current_id = room.spotlight_id
        if not current_id:
            raise ValueError("当前没有正在发言的玩家。")
        advance_discussion(room, current_id, forced_by_host=True)
        notice = "房主手动切换到了下一位发言玩家。"
    elif room.phase == "day_last_words":
        current_id = current_last_words_speaker(room)
        if not current_id:
            raise ValueError("当前没有正在发表遗言的玩家。")
        advance_last_words(room, current_id)
        notice = "房主手动切换到了下一位遗言玩家。"
    else:
        raise ValueError("当前阶段没有可以推进的发言。")
    await push_notice(session, notice)
    schedule_bot_progress(session)


async def handle_voice_state(
    session: ConnectedRoom,
    player: PlayerState,
    *,
    manual_open: bool | None,
    speaking: bool | None,
    volume: float | None,
) -> None:
    set_voice_state(
        session.room,
        player.player_id,
        manual_open=player.voice_manual_open if manual_open is None else manual_open,
        speaking=player.voice_speaking if speaking is None else speaking,
        volume=player.voice_volume if volume is None else volume,
    )
    refresh_voice_policy(session.room)
    await broadcast_room_state(session)


async def handle_host_voice_control(
    session: ConnectedRoom,
    player: PlayerState,
    *,
    target_id: str,
    muted: bool | None,
    blacklisted: bool | None,
) -> None:
    require_host(session, player)
    if target_id not in session.room.players:
        raise ValueError("目标玩家不存在。")
    set_host_voice_penalty(
        session.room,
        target_id,
        muted=muted,
        blacklisted=blacklisted,
    )
    target = session.room.players[target_id]
    await push_notice(
        session,
        f"房主已更新 {player_display_name(session.room, target)} 的语音状态："
        f"{'禁言' if target.host_muted else '未禁言'}，"
        f"{'已拉黑' if target.host_blacklisted else '未拉黑'}。",
    )


async def relay_signal(
    session: ConnectedRoom,
    sender: PlayerState,
    *,
    target_id: str,
    signal_payload: dict[str, Any],
) -> None:
    if not can_exchange_voice(session.room, sender.player_id, target_id):
        raise ValueError("当前阶段不可与该玩家建立语音连接。")
    epoch = f"{session.room.round_number}:{session.room.phase}"
    if signal_payload.get("voiceEpoch") != epoch:
        return  # Ignore an offer/ICE packet from a previous phase.
    target_player = session.room.players.get(target_id)
    if not target_player or target_player.is_bot:
        raise ValueError("目标玩家当前不可建立语音连接。")
    target_ws = session.sockets.get(target_id)
    if not target_ws:
        raise ValueError("目标玩家当前不在线。")
    await send(
        target_ws,
        "signal",
        sourceId=sender.player_id,
        payload=signal_payload,
    )


async def index(request: web.Request) -> web.FileResponse:
    return web.FileResponse(STATIC_DIR / "index.html")


async def list_rooms(request: web.Request) -> web.Response:
    origin = request_origin(request)
    payload = []
    for session in rooms.values():
        room = session.room
        if room.started:
            continue
        payload.append(
            {
                "roomCode": room.code,
                "players": len(room.players),
                "humanPlayers": len(human_players(room)),
                "botPlayers": len(bot_players(room)),
                "requiredPlayers": required_player_count(room),
                "preset": room.config_preset,
                "presetLabel": PRESET_LABELS[room.config_preset],
                "allowSelfDestruct": room.allow_self_destruct,
                "enableAiMode": room.enable_ai_mode,
                "joinUrl": f"{origin}/?join={room.code}",
                "qrUrl": f"{origin}/api/rooms/{room.code}/qr.svg",
                "createdAt": session.created_at,
            }
        )
    payload.sort(key=lambda item: item["createdAt"], reverse=True)
    return web.json_response({"rooms": payload, "serverOrigin": origin, "lanIp": detect_lan_ip()})


async def list_preset_rules(request: web.Request) -> web.Response:
    """Expose the same rule data used by the active game engine for lobby previews."""
    return web.json_response(
        {
            "presets": [preset_rulebook(preset) for preset in ROLE_PRESETS],
        }
    )


async def room_qr_svg(request: web.Request) -> web.Response:
    code = request.match_info["code"].strip()
    session = rooms.get(code)
    if not session:
        return web.Response(status=404, text="Room not found")

    qr = qrcode.make(
        build_qr_text(session),
        image_factory=qrcode.image.svg.SvgImage,
        box_size=8,
        border=2,
    )
    buffer = io.BytesIO()
    qr.save(buffer)
    return web.Response(body=buffer.getvalue(), content_type="image/svg+xml")


async def service_worker(request: web.Request) -> web.FileResponse:
    return web.FileResponse(STATIC_DIR / "service-worker.js")


async def websocket_handler(request: web.Request) -> web.WebSocketResponse:
    ws = web.WebSocketResponse(heartbeat=30)
    await ws.prepare(request)

    try:
        async for msg in ws:
            if msg.type != WSMsgType.TEXT:
                continue

            try:
                payload = json.loads(msg.data)
            except json.JSONDecodeError:
                await send_error(ws, "消息格式错误。")
                continue

            if not isinstance(payload, dict):
                await send_error(ws, "消息格式错误。")
                continue

            message_type = str(payload.get("type", "")).strip()
            session, player = get_connected_room(ws)

            try:
                if message_type == "network_ping":
                    await handle_network_ping(ws, payload.get("probeId"))
                    continue

                if message_type == "create_room":
                    if session:
                        raise ValueError("你已经在房间里了。")
                    await create_room(
                        request,
                        ws,
                        name=str(payload.get("name", "")).strip() or "房主",
                        preset=str(payload.get("preset", "standard")).strip() or "standard",
                        allow_self_destruct=bool(payload.get("allowSelfDestruct", True)),
                        enable_ai_mode=bool(payload.get("enableAiMode", False)),
                        session_token=normalize_session_token(payload.get("sessionToken")),
                    )
                    continue

                if message_type == "join_room":
                    if session:
                        raise ValueError("你已经在房间里了。")
                    await join_room(
                        ws,
                        code=str(payload.get("roomCode", "")).strip(),
                        name=str(payload.get("name", "")).strip() or "玩家",
                        session_token=normalize_session_token(payload.get("sessionToken")),
                    )
                    continue

                if message_type == "resume_session":
                    if session:
                        raise ValueError("当前连接已经在房间内。")
                    await resume_session(
                        request,
                        ws,
                        code=str(payload.get("roomCode", "")).strip(),
                        session_token=normalize_session_token(payload.get("sessionToken")),
                    )
                    continue

                if message_type == "leave_room":
                    remaining_session = await leave_room(ws)
                    await send(ws, "left_room", message="你已退出当前房间。")
                    if remaining_session:
                        await broadcast_room_state(remaining_session)
                        schedule_bot_progress(remaining_session)
                    continue

                if not session or not player:
                    raise ValueError("请先加入房间。")


                if message_type == "start_game":
                    await start_match(session, player)
                elif message_type == "update_config":
                    await update_config_message(
                        session,
                        player,
                        preset=str(payload.get("preset", session.room.config_preset)).strip(),
                        allow_self_destruct=bool(payload.get("allowSelfDestruct", session.room.allow_self_destruct)),
                        enable_ai_mode=bool(payload.get("enableAiMode", session.room.enable_ai_mode)),
                    )
                elif message_type == "game_action":
                    await handle_game_action(session, player, ws, payload)
                elif message_type == "wolf_chat":
                    await handle_wolf_chat(session, player, str(payload.get("content", "")))
                elif message_type == "force_next_speech":
                    await force_next_speech(session, player)
                elif message_type == "set_manual_mic":
                    await handle_voice_state(
                        session,
                        player,
                        manual_open=bool(payload.get("open")),
                        speaking=None,
                        volume=None,
                    )
                elif message_type == "voice_activity":
                    await handle_voice_state(
                        session,
                        player,
                        manual_open=payload.get("manualOpen"),
                        speaking=bool(payload.get("speaking", False)),
                        volume=validated_voice_volume(payload.get("volume", 0.0)),
                    )
                elif message_type == "host_voice_control":
                    await handle_host_voice_control(
                        session,
                        player,
                        target_id=str(payload.get("targetId", "")),
                        muted=payload.get("muted"),
                        blacklisted=payload.get("blacklisted"),
                    )
                elif message_type == "signal":
                    signal_payload = payload.get("payload")
                    if not isinstance(signal_payload, dict):
                        raise ValueError("信令消息格式错误。")
                    await relay_signal(
                        session,
                        player,
                        target_id=str(payload.get("targetId", "")),
                        signal_payload=signal_payload,
                    )
                elif message_type == "sync_state":
                    await broadcast_room_state(session)
                else:
                    raise ValueError("未知消息类型。")
            except ValueError as error:
                await send_error(ws, str(error))
            except Exception as error:  # pragma: no cover - 防御未预期的处理异常
                import traceback

                traceback.print_exc()
                await send_error(ws, f"服务器处理消息时出错：{error}")
    finally:
        await disconnect_room(ws)

    return ws


def make_app(settings: NetworkSettings | None = None) -> web.Application:
    app = web.Application()
    app[NETWORK_SETTINGS_KEY] = settings if settings is not None else load_network_settings()
    app.router.add_get("/", index)
    app.router.add_static("/static/", path=STATIC_DIR, show_index=False)
    app.router.add_get("/api/presets", list_preset_rules)
    app.router.add_get("/api/rooms", list_rooms)
    app.router.add_get("/api/rooms/{code}/qr.svg", room_qr_svg)
    app.router.add_get("/service-worker.js", service_worker)
    app.router.add_get("/ws", websocket_handler)
    return app


if __name__ == "__main__":
    network = load_network_settings()
    web.run_app(make_app(network), host=network.listen_host, port=network.listen_port or 8080)
