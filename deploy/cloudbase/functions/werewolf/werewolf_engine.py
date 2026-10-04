from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Any


ROLE_META: dict[str, dict[str, Any]] = {
    "werewolf": {"label": "狼人", "team": "wolf"},
    "white_wolf_king": {"label": "白狼王", "team": "wolf"},
    "villager": {"label": "平民", "team": "villager"},
    "seer": {"label": "预言家", "team": "god"},
    "witch": {"label": "女巫", "team": "god"},
    "guard": {"label": "守卫", "team": "god"},
    "hunter": {"label": "猎人", "team": "god"},
    "knight": {"label": "骑士", "team": "god"},
}

ROLE_PRESETS: dict[str, list[str]] = {
    "nine_hunter": [
        "werewolf", "werewolf", "werewolf",
        "villager", "villager", "villager",
        "seer", "witch", "hunter",
    ],
    "nine_knight": [
        "werewolf", "werewolf", "werewolf",
        "villager", "villager", "villager",
        "seer", "witch", "knight",
    ],
    "ten_guard": [
        "werewolf", "werewolf", "werewolf",
        "villager", "villager", "villager", "villager",
        "seer", "witch", "guard",
    ],
    "ten_white_wolf_king": [
        "white_wolf_king", "werewolf", "werewolf",
        "villager", "villager", "villager", "villager",
        "seer", "witch", "guard",
    ],
    "eleven_guard": [
        "werewolf", "werewolf", "werewolf", "werewolf",
        "villager", "villager", "villager", "villager",
        "seer", "witch", "guard",
    ],
    "eleven_knight": [
        "werewolf", "werewolf", "werewolf", "werewolf",
        "villager", "villager", "villager", "villager",
        "seer", "witch", "knight",
    ],
    "standard": [
        "werewolf",
        "werewolf",
        "werewolf",
        "werewolf",
        "villager",
        "villager",
        "villager",
        "villager",
        "seer",
        "witch",
        "guard",
        "hunter",
    ],
    "white_wolf_king": [
        "white_wolf_king",
        "werewolf",
        "werewolf",
        "werewolf",
        "villager",
        "villager",
        "villager",
        "villager",
        "seer",
        "witch",
        "guard",
        "hunter",
    ],
    "knight": [
        "werewolf",
        "werewolf",
        "werewolf",
        "werewolf",
        "villager",
        "villager",
        "villager",
        "villager",
        "seer",
        "witch",
        "guard",
        "knight",
    ],
    "white_wolf_king_knight": [
        "white_wolf_king",
        "werewolf",
        "werewolf",
        "werewolf",
        "villager",
        "villager",
        "villager",
        "villager",
        "seer",
        "witch",
        "guard",
        "knight",
    ],
}

PRESET_LABELS = {
    "nine_hunter": "9 人猎人局（3 狼 3 民 3 神）",
    "nine_knight": "9 人骑士局（3 狼 3 民 3 神）",
    "ten_guard": "10 人守卫局（3 狼 4 民 3 神）",
    "ten_white_wolf_king": "10 人白狼王局（3 狼 4 民 3 神）",
    "eleven_guard": "11 人守卫局（4 狼 4 民 3 神）",
    "eleven_knight": "11 人骑士局（4 狼 4 民 3 神）",
    "standard": "标准 4 狼 4 民 4 神",
    "white_wolf_king": "白狼王板子",
    "knight": "骑士板子",
    "white_wolf_king_knight": "白狼王 + 骑士",
}

# The rules shown in the client are intentionally kept beside the executable
# role definitions.  That way a board cannot silently drift away from the
# mechanics that actually run on the server.
ROLE_RULES: dict[str, dict[str, str]] = {
    "werewolf": {
        "ability": "每夜先与仍存活的狼队友进行 30 秒私密密谈；随后每名存活狼人各提交一票决定刀口，不能攻击狼队友。",
        "limits": "所有存活狼人完成投票后才会进入下一夜间技能；密谈倒计时结束会自动进入选刀；最高票并列或全体弃票时当夜空刀。",
    },
    "white_wolf_king": {
        "ability": "拥有狼人全部夜间能力。若在白天被公投出局或发动自爆，可额外带走一名其他存活玩家。",
        "limits": "夜间被击杀不会触发带人；带人目标不能是自己。",
    },
    "villager": {
        "ability": "没有夜间技能；通过白天发言、投票和票型信息协助找出狼人。",
        "limits": "平民阵营全部出局时，狼人立刻获胜。",
    },
    "seer": {
        "ability": "每晚查验一名其他存活玩家，私下得到“狼人阵营”或“好人阵营”的结果。",
        "limits": "每晚只能查验一次，查验结果不会自动公开。",
    },
    "witch": {
        "ability": "拥有一瓶解药和一瓶毒药；能看到当夜被狼人攻击的玩家。",
        "limits": "两瓶药整局各只能用一次；每晚最多使用一瓶；不能毒自己。",
    },
    "guard": {
        "ability": "每晚守护一名存活玩家，被守护者当夜不会被狼人击杀。",
        "limits": "不能连续两晚守护同一名玩家。",
    },
    "hunter": {
        "ability": "死亡时可选择开枪带走一名其他存活玩家，也可以选择不开枪。",
        "limits": "被女巫毒杀时不能开枪；其他符合条件的死亡会触发该技能。",
    },
    "knight": {
        "ability": "白天轮到自己顺序发言时，可发动一次决斗，指定一名其他存活玩家。",
        "limits": "目标是狼人则目标出局并继续白天；目标不是狼人则骑士出局并直接进入夜晚。",
    },
}

ROUND_FLOW = [
    "夜晚会按当前板子中仍存活的角色依次行动；没有的角色会自动跳过。",
    "守卫 → 狼人密谈（30 秒）→ 狼人刀人 → 预言家验人 → 女巫用药 → 夜晚结算。",
    "白天有死亡时先处理遗言；随后存活玩家顺序发言，再进入 20 秒公投。",
    "开启自爆时，狼人可在白天发言或公投阶段自爆中断白天；白狼王带人及猎人连锁技能结算后直接进入下一夜，不再发表遗言。",
]

WIN_CONDITIONS = [
    "场上没有存活狼人时，好人阵营胜利。",
    "平民阵营或神职阵营任一方被全部淘汰时，狼人阵营胜利（屠边规则）。",
]

INFORMATION_RULES = [
    "进行中的对局里，玩家只会看到自己的身份；狼人之间会互认。",
    "夜间死亡只公布“夜间出局”，不公开刀口、毒口或叠加死因；个人技能所得信息仍只对本人可见。",
    "对局结束后，所有玩家身份及具体出局原因会公开，已结算的胜负不会因玩家离场而改变。",
]

PHASE_LABELS = {
    "lobby": "准备阶段",
    "night_guard": "夜晚：守卫行动",
    "night_wolf_discussion": "夜晚：狼人密谈",
    "night_wolves": "夜晚：狼人刀人",
    "night_seer": "夜晚：预言家验人",
    "night_witch": "夜晚：女巫用药",
    "night_hunter": "夜晚：猎人开枪",
    "day_break": "白天：公布夜亡",
    "day_last_words": "白天：遗言阶段",
    "day_discussion": "白天：顺序发言",
    "day_vote": "白天：公投阶段",
    "day_hunter": "白天：猎人开枪",
    "day_white_wolf_king": "白天：白狼王带人",
    "ended": "对局结束",
}

PUBLIC_ROLE_REVEAL_PHASES = {"ended"}


@dataclass
class PlayerState:
    player_id: str
    name: str
    is_bot: bool = False
    session_token: str = ""
    connected: bool = True
    role: str = "villager"
    alive: bool = True
    death_reason: str | None = None
    joined_order: int = 0
    player_number: int = 0
    witch_antidote_used: bool = False
    witch_poison_used: bool = False
    hunter_shot_used: bool = False
    knight_duel_used: bool = False
    inspected_result: str | None = None
    voice_manual_open: bool = False
    voice_effective_open: bool = False
    voice_speaking: bool = False
    voice_volume: float = 0.0
    host_muted: bool = False
    host_blacklisted: bool = False
    bot_memory: dict[str, Any] = field(default_factory=dict)


@dataclass
class NightState:
    round_number: int = 0
    guard_target_id: str | None = None
    last_guard_target_id: str | None = None
    wolf_votes: dict[str, str | None] = field(default_factory=dict)
    wolf_chat: list[dict[str, str]] = field(default_factory=list)
    attacked_player_id: str | None = None
    seer_target_id: str | None = None
    seer_result: str | None = None
    witch_save: bool = False
    witch_poison_target_id: str | None = None
    deaths: list[str] = field(default_factory=list)


@dataclass
class DayState:
    public_deaths: list[str] = field(default_factory=list)
    speech_queue: list[str] = field(default_factory=list)
    speech_index: int = 0
    last_words_queue: list[str] = field(default_factory=list)
    last_words_index: int = 0
    last_words_scope: str = "discussion"
    skip_last_words: bool = False
    votes: dict[str, str | None] = field(default_factory=dict)
    vote_records: dict[str, dict[str, Any]] = field(default_factory=dict)
    vote_ranking: list[dict[str, Any]] = field(default_factory=list)
    abstain_count: int = 0
    vote_result_text: str | None = None
    eliminated_player_id: str | None = None


@dataclass
class PendingSkill:
    skill_type: str
    source_player_id: str
    day_scope: str = "continue"


@dataclass
class RoomState:
    code: str
    host_id: str
    players: dict[str, PlayerState] = field(default_factory=dict)
    next_join_order: int = 1
    config_preset: str = "standard"
    allow_self_destruct: bool = True
    enable_ai_mode: bool = False
    started: bool = False
    phase: str = "lobby"
    round_number: int = 0
    winner: str | None = None
    winner_label: str | None = None
    notice_log: list[str] = field(default_factory=list)
    last_vote_summary: dict[str, Any] | None = None
    spotlight_id: str | None = None
    night: NightState = field(default_factory=NightState)
    day: DayState = field(default_factory=DayState)
    pending_skills: list[PendingSkill] = field(default_factory=list)


def role_label(role_id: str) -> str:
    return ROLE_META[role_id]["label"]


def preset_labels(preset: str) -> list[str]:
    return [role_label(role_id) for role_id in ROLE_PRESETS[preset]]


def preset_rulebook(preset: str) -> dict[str, Any]:
    """Return the client-safe, mechanics-backed rules for one playable board."""
    if preset not in ROLE_PRESETS:
        raise ValueError("未知的身份板子配置。")

    roles = ROLE_PRESETS[preset]
    camp_counts = {"wolf": 0, "villager": 0, "god": 0}
    ordered_role_ids: list[str] = []
    for role_id in roles:
        camp_counts[ROLE_META[role_id]["team"]] += 1
        if role_id not in ordered_role_ids:
            ordered_role_ids.append(role_id)

    return {
        "preset": preset,
        "label": PRESET_LABELS[preset],
        "playerCount": len(roles),
        "campCounts": camp_counts,
        "roles": [
            {
                "id": role_id,
                "label": role_label(role_id),
                "team": ROLE_META[role_id]["team"],
                "count": roles.count(role_id),
                "ability": ROLE_RULES[role_id]["ability"],
                "limits": ROLE_RULES[role_id]["limits"],
            }
            for role_id in ordered_role_ids
        ],
        "flow": list(ROUND_FLOW),
        "victory": list(WIN_CONDITIONS),
        "information": list(INFORMATION_RULES),
    }


def phase_label(phase: str) -> str:
    return PHASE_LABELS[phase]


def player_team(player: PlayerState) -> str:
    return ROLE_META[player.role]["team"]


def wolves_in_room(room: RoomState, alive_only: bool = True) -> list[PlayerState]:
    return [
        player
        for player in room.players.values()
        if player_team(player) == "wolf" and (player.alive or not alive_only)
    ]


def living_players(room: RoomState) -> list[PlayerState]:
    return [player for player in room.players.values() if player.alive]


def living_ids(room: RoomState) -> list[str]:
    return [player.player_id for player in living_players(room)]


def living_good_players(room: RoomState, team: str) -> list[PlayerState]:
    return [
        player
        for player in room.players.values()
        if player.alive and player_team(player) == team
    ]


def ordered_players(room: RoomState) -> list[PlayerState]:
    return sorted(
        room.players.values(),
        key=lambda player: (
            player.joined_order if player.joined_order > 0 else float("inf"),
            player.player_id,
        ),
    )


def refresh_player_numbers(room: RoomState) -> None:
    highest_joined_order = 0
    used = {p.player_number for p in room.players.values() if p.player_number > 0} if room.started else set()
    next_number = max(used, default=0) + 1
    for index, player in enumerate(ordered_players(room), start=1):
        if not room.started:
            player.player_number = index
        elif player.player_number <= 0:
            player.player_number = next_number
            next_number += 1
        highest_joined_order = max(highest_joined_order, player.joined_order)
    room.next_join_order = max(room.next_join_order, highest_joined_order + 1)


def claim_next_join_order(room: RoomState) -> int:
    refresh_player_numbers(room)
    joined_order = max(room.next_join_order, 1)
    room.next_join_order = joined_order + 1
    return joined_order


def player_display_name(room: RoomState, player_ref: PlayerState | str) -> str:
    refresh_player_numbers(room)
    player = room.players[player_ref] if isinstance(player_ref, str) else player_ref
    return f"{player.player_number}号 {player.name}"


def add_notice(room: RoomState, message: str) -> None:
    room.notice_log.insert(0, message)
    room.notice_log[:] = room.notice_log[:60]


def current_last_words_speaker(room: RoomState) -> str | None:
    if room.phase != "day_last_words":
        return None
    if room.day.last_words_index >= len(room.day.last_words_queue):
        return None
    return room.day.last_words_queue[room.day.last_words_index]


def current_day_speaker(room: RoomState) -> str | None:
    if room.phase != "day_discussion":
        return None
    if room.day.speech_index >= len(room.day.speech_queue):
        return None
    return room.day.speech_queue[room.day.speech_index]


def visible_role_id(viewer: PlayerState, target: PlayerState, room: RoomState) -> str | None:
    if room.phase in PUBLIC_ROLE_REVEAL_PHASES:
        return target.role
    if viewer.player_id == target.player_id:
        return target.role
    if player_team(viewer) == "wolf" and player_team(target) == "wolf" and room.started:
        return target.role
    return None


def set_voice_state(
    room: RoomState,
    player_id: str,
    *,
    manual_open: bool,
    speaking: bool,
    volume: float,
) -> None:
    player = room.players[player_id]
    player.voice_manual_open = manual_open
    player.voice_speaking = speaking
    player.voice_volume = max(0.0, min(1.0, volume))


def set_host_voice_penalty(
    room: RoomState,
    target_id: str,
    *,
    muted: bool | None = None,
    blacklisted: bool | None = None,
) -> None:
    player = room.players[target_id]
    if muted is not None:
        player.host_muted = muted
    if blacklisted is not None:
        player.host_blacklisted = blacklisted


def speaking_player_ids(room: RoomState) -> set[str]:
    if room.phase == "lobby":
        return set()
    if room.phase == "night_guard":
        return {player.player_id for player in living_good_players(room, "god") if player.role == "guard"}
    if room.phase in {"night_wolf_discussion", "night_wolves"}:
        return {player.player_id for player in wolves_in_room(room)}
    if room.phase == "night_seer":
        return {player.player_id for player in room.players.values() if player.alive and player.role == "seer"}
    if room.phase == "night_witch":
        return {player.player_id for player in room.players.values() if player.alive and player.role == "witch"}
    if room.phase in {"night_hunter", "day_hunter", "day_white_wolf_king"}:
        return {room.spotlight_id} if room.spotlight_id else set()
    if room.phase in {"day_break", "day_vote"}:
        return set()
    if room.phase in {"day_last_words", "day_discussion"}:
        return {room.spotlight_id} if room.spotlight_id else set()
    if room.phase == "ended":
        return {player.player_id for player in living_players(room)}
    return set()


PRIVATE_NIGHT_PHASES = {"night_guard", "night_wolf_discussion", "night_wolves", "night_seer", "night_witch"}


def can_exchange_voice(room: RoomState, first_id: str, second_id: str) -> bool:
    first, second = room.players.get(first_id), room.players.get(second_id)
    if first is None or second is None:
        return False
    if first_id == second_id:
        return True
    if room.phase not in PRIVATE_NIGHT_PHASES:
        return True
    return (room.phase in {"night_wolf_discussion", "night_wolves"}
            and first.alive and second.alive
            and player_team(first) == "wolf" and player_team(second) == "wolf")


def visible_spotlight_id(room: RoomState, viewer_id: str) -> str | None:
    if room.phase in PRIVATE_NIGHT_PHASES and viewer_id != room.spotlight_id:
        return None
    return room.spotlight_id


def refresh_voice_policy(room: RoomState) -> None:
    auto_open_ids = speaking_player_ids(room)
    for player in room.players.values():
        can_speak_while_dead = (
            room.spotlight_id == player.player_id
            and room.phase in {"day_last_words", "night_hunter", "day_hunter", "day_white_wolf_king"}
        )
        effective_open = (
            not player.host_muted
            and player.player_id in auto_open_ids
            and (player.alive or can_speak_while_dead)
            and room.started
        )
        if room.phase == "ended":
            effective_open = not player.host_muted and (
                player.voice_manual_open or player.alive
            )
        elif room.phase == "lobby":
            effective_open = not player.host_muted and player.voice_manual_open
        player.voice_effective_open = effective_open


def update_room_config(room: RoomState, *, preset: str, allow_self_destruct: bool) -> None:
    if room.started:
        raise ValueError("游戏开始后不能再修改房间配置。")
    if preset not in ROLE_PRESETS:
        raise ValueError("未知的身份板子配置。")
    if len(room.players) > len(ROLE_PRESETS[preset]):
        raise ValueError(
            f"当前房间已有 {len(room.players)} 人，不能切换到只支持 "
            f"{len(ROLE_PRESETS[preset])} 人的板子。"
        )
    room.config_preset = preset
    room.allow_self_destruct = allow_self_destruct


def update_ai_mode(room: RoomState, *, enable_ai_mode: bool) -> None:
    if room.started:
        raise ValueError("游戏开始后不能再修改人机模式。")
    room.enable_ai_mode = enable_ai_mode


def assign_roles(room: RoomState, rng: random.Random | None = None) -> None:
    if len(room.players) != len(ROLE_PRESETS[room.config_preset]):
        raise ValueError("当前板子要求玩家人数与身份池数量一致。")
    role_pool = list(ROLE_PRESETS[room.config_preset])
    (rng or random).shuffle(role_pool)
    for index, player in enumerate(room.players.values()):
        player.role = role_pool[index]
        player.alive = True
        player.death_reason = None
        player.witch_antidote_used = False
        player.witch_poison_used = False
        player.hunter_shot_used = False
        player.knight_duel_used = False
        player.inspected_result = None
        player.bot_memory.clear()


def start_game(room: RoomState, rng: random.Random | None = None) -> None:
    if room.started:
        raise ValueError("对局已经开始，不能重复开始或重置。")
    refresh_player_numbers(room)
    assign_roles(room, rng=rng)
    room.started = True
    room.phase = "night_guard"
    room.round_number = 1
    room.winner = None
    room.winner_label = None
    room.last_vote_summary = None
    room.notice_log.clear()
    room.pending_skills.clear()
    room.day = DayState()
    room.night = NightState(round_number=1)
    room.spotlight_id = None
    add_notice(room, "游戏开始，进入第一夜。")
    advance_to_next_available_night_phase(room, from_phase="night_guard")


def begin_new_night(room: RoomState) -> None:
    room.day = DayState()
    room.pending_skills.clear()
    room.spotlight_id = None
    last_guard_target = room.night.guard_target_id
    room.night = NightState(round_number=room.round_number, last_guard_target_id=last_guard_target)
    room.phase = "night_guard"
    add_notice(room, f"进入第 {room.round_number} 夜。")
    advance_to_next_available_night_phase(room, from_phase="night_guard")


def advance_to_next_available_night_phase(room: RoomState, *, from_phase: str) -> None:
    ordered_phases = ["night_guard", "night_wolf_discussion", "night_wolves", "night_seer", "night_witch"]
    phase_roles = {
        "night_guard": "guard",
        "night_wolf_discussion": None,
        "night_wolves": None,
        "night_seer": "seer",
        "night_witch": "witch",
    }

    start_index = ordered_phases.index(from_phase)
    for phase in ordered_phases[start_index:]:
        if phase == "night_wolf_discussion":
            if wolves_in_room(room):
                room.phase = phase
                room.spotlight_id = None
                refresh_voice_policy(room)
                return
            continue
        if phase == "night_wolves":
            if wolves_in_room(room):
                room.phase = phase
                room.spotlight_id = None
                refresh_voice_policy(room)
                return
            continue

        role_id = phase_roles[phase]
        if role_id and any(player.alive and player.role == role_id for player in room.players.values()):
            room.phase = phase
            room.spotlight_id = next(
                player.player_id
                for player in room.players.values()
                if player.alive and player.role == role_id
            )
            refresh_voice_policy(room)
            return

    resolve_night(room)


def submit_guard(room: RoomState, actor_id: str, target_id: str) -> str:
    actor = room.players[actor_id]
    if room.phase != "night_guard" or not actor.alive or actor.role != "guard":
        raise ValueError("当前不是守卫的行动回合。")
    if target_id not in room.players or not room.players[target_id].alive:
        raise ValueError("守卫目标不存在或已出局。")
    if room.night.last_guard_target_id == target_id:
        raise ValueError("守卫不能连续两晚守同一名玩家。")
    room.night.guard_target_id = target_id
    add_notice(room, "守卫已完成行动。")
    advance_to_next_available_night_phase(room, from_phase="night_wolf_discussion")
    return f"你今晚守护了 {player_display_name(room, target_id)}。"


def submit_wolf_vote(room: RoomState, actor_id: str, target_id: str | None) -> str:
    actor = room.players[actor_id]
    if room.phase != "night_wolves" or not actor.alive or player_team(actor) != "wolf":
        raise ValueError("当前不是狼人行动回合。")
    if target_id is not None:
        if target_id not in room.players or not room.players[target_id].alive:
            raise ValueError("狼人目标不存在或已出局。")
        if player_team(room.players[target_id]) == "wolf":
            raise ValueError("狼人不能刀同伴。")
    room.night.wolf_votes[actor_id] = target_id
    living_wolves = wolves_in_room(room)
    if all(wolf.player_id in room.night.wolf_votes for wolf in living_wolves):
        room.night.attacked_player_id = resolve_wolf_target(room)
        advance_to_next_available_night_phase(room, from_phase="night_seer")
    return "已提交你的狼人投票。"


def finish_wolf_discussion(room: RoomState) -> None:
    if room.phase != "night_wolf_discussion":
        return
    advance_to_next_available_night_phase(room, from_phase="night_wolves")


def submit_wolf_chat(room: RoomState, actor_id: str, content: str) -> str:
    actor = room.players[actor_id]
    message = content.strip()[:240]
    if room.phase != "night_wolf_discussion" or not actor.alive or player_team(actor) != "wolf":
        raise ValueError("当前不在狼人密谈阶段。")
    if not message:
        raise ValueError("密谈内容不能为空。")
    room.night.wolf_chat.append({"playerId": actor_id, "content": message})
    return message


def resolve_wolf_target(room: RoomState) -> str | None:
    counter: dict[str, int] = {}
    for target_id in room.night.wolf_votes.values():
        if target_id is None:
            continue
        counter[target_id] = counter.get(target_id, 0) + 1
    if not counter:
        return None
    max_votes = max(counter.values())
    candidates = [target_id for target_id, count in counter.items() if count == max_votes]
    if len(candidates) != 1:
        return None
    return candidates[0]


def submit_seer(room: RoomState, actor_id: str, target_id: str) -> str:
    actor = room.players[actor_id]
    if room.phase != "night_seer" or not actor.alive or actor.role != "seer":
        raise ValueError("当前不是预言家的行动回合。")
    if target_id not in room.players or not room.players[target_id].alive:
        raise ValueError("预言家目标不存在或已出局。")
    if target_id == actor_id:
        raise ValueError("不能查验自己。")
    target = room.players[target_id]
    result = "狼人阵营" if player_team(target) == "wolf" else "好人阵营"
    actor.inspected_result = f"{player_display_name(room, target)} 是 {result}。"
    room.night.seer_target_id = target_id
    room.night.seer_result = result
    add_notice(room, "预言家已完成行动。")
    advance_to_next_available_night_phase(room, from_phase="night_witch")
    return actor.inspected_result


def submit_witch(
    room: RoomState,
    actor_id: str,
    *,
    save: bool,
    poison_target_id: str | None,
) -> str:
    actor = room.players[actor_id]
    if room.phase != "night_witch" or not actor.alive or actor.role != "witch":
        raise ValueError("当前不是女巫的行动回合。")
    if save and actor.witch_antidote_used:
        raise ValueError("你的解药已经使用过了。")
    if poison_target_id is not None and actor.witch_poison_used:
        raise ValueError("你的毒药已经使用过了。")
    if save and poison_target_id is not None:
        raise ValueError("当前实现里女巫每晚只能使用一瓶药。")
    if save and room.night.attacked_player_id is None:
        raise ValueError("今晚没有可救的目标。")
    if poison_target_id is not None:
        if poison_target_id not in room.players or not room.players[poison_target_id].alive:
            raise ValueError("毒药目标不存在或已出局。")
        if poison_target_id == actor.player_id:
            raise ValueError("不能对自己使用毒药。")

    room.night.witch_save = save
    room.night.witch_poison_target_id = poison_target_id
    if save:
        actor.witch_antidote_used = True
    if poison_target_id is not None:
        actor.witch_poison_used = True
    resolve_night(room)
    return "已提交女巫操作。"


def resolve_night(room: RoomState) -> None:
    attacked_id = room.night.attacked_player_id
    poison_id = room.night.witch_poison_target_id
    deaths: list[tuple[str, str]] = []

    guarded_same = attacked_id is not None and attacked_id == room.night.guard_target_id
    saved_by_witch = attacked_id is not None and room.night.witch_save and not guarded_same
    if attacked_id is not None and not guarded_same and not saved_by_witch:
        deaths.append((attacked_id, "夜间被狼人击杀"))
    if poison_id is not None:
        deaths.append((poison_id, "被女巫毒杀"))

    unique_deaths: list[tuple[str, str]] = []
    death_indexes: dict[str, int] = {}
    for player_id, reason in deaths:
        existing_index = death_indexes.get(player_id)
        if existing_index is None:
            death_indexes[player_id] = len(unique_deaths)
            unique_deaths.append((player_id, reason))
            continue
        # Keep both causes when a player is hit by the wolves and poisoned in
        # the same night.  In particular, the hunter rule can then reliably
        # identify a poisoning and deny the shot as intended.
        existing_id, existing_reason = unique_deaths[existing_index]
        unique_deaths[existing_index] = (existing_id, f"{existing_reason}；{reason}")

    room.night.deaths = [player_id for player_id, _ in unique_deaths]
    for player_id, reason in unique_deaths:
        mark_player_dead(room, player_id, reason)

    room.day.public_deaths = list(room.night.deaths)
    room.day.last_words_scope = "discussion"
    add_notice(
        room,
        "夜晚结算完成。"
        if room.day.public_deaths
        else "平安夜，昨晚无人出局。",
    )
    room.phase = "day_break"
    room.spotlight_id = None

    maybe_queue_death_skills(
        room,
        room.day.public_deaths,
        source_phase="night",
    )
    continue_after_resolution(room, day_scope="continue")


def mark_player_dead(room: RoomState, player_id: str, reason: str) -> None:
    player = room.players[player_id]
    player.alive = False
    player.death_reason = reason


def maybe_queue_death_skills(room: RoomState, player_ids: list[str], *, source_phase: str) -> None:
    for player_id in player_ids:
        player = room.players[player_id]
        if player.role == "hunter" and not player.hunter_shot_used and reason_allows_hunter_shot(player.death_reason):
            room.pending_skills.append(
                PendingSkill(
                    skill_type="hunter_shot",
                    source_player_id=player_id,
                    day_scope="next_night" if source_phase in {"day_end", "vote"} else "continue",
                )
            )
        if player.role == "white_wolf_king" and source_phase in {"vote", "self_destruct"}:
            room.pending_skills.append(
                PendingSkill(
                    skill_type="white_wolf_king_blast",
                    source_player_id=player_id,
                    day_scope="next_night",
                )
            )


def reason_allows_hunter_shot(reason: str | None) -> bool:
    return reason is not None and "毒" not in reason


def continue_after_resolution(room: RoomState, *, day_scope: str) -> None:
    if room.phase == "ended":
        return
    refresh_voice_policy(room)
    pending = next_pending_skill(room, day_scope=day_scope)
    if pending is not None:
        enter_pending_skill_phase(room, pending)
        refresh_voice_policy(room)
        return

    # Death-triggered skills resolve before the final win check.  Without this
    # order a hunter or white wolf king could be shown as having a pending
    # skill, yet the match would end before the player could ever use it.
    if apply_winner_if_ready(room):
        return

    if room.phase == "day_break" and not room.day.skip_last_words:
        start_last_words_or_discussion(room)
        refresh_voice_policy(room)
        return

    if day_scope == "next_night":
        room.round_number += 1
        begin_new_night(room)
        refresh_voice_policy(room)
        return

    refresh_voice_policy(room)


def apply_winner_if_ready(room: RoomState) -> bool:
    if room.phase == "ended" or room.winner is not None:
        return True
    winner = evaluate_winner(room)
    if winner is None:
        return False
    room.phase = "ended"
    room.winner = winner
    room.winner_label = "狼人胜利" if winner == "wolf" else "好人胜利"
    room.spotlight_id = None
    add_notice(room, room.winner_label)
    refresh_voice_policy(room)
    return True


def next_pending_skill(room: RoomState, *, day_scope: str) -> PendingSkill | None:
    for pending in room.pending_skills:
        if pending.day_scope == day_scope:
            return pending
    return None


def enter_pending_skill_phase(room: RoomState, pending: PendingSkill) -> None:
    room.pending_skills.remove(pending)
    room.spotlight_id = pending.source_player_id
    if pending.skill_type == "hunter_shot":
        death_reason = room.players[pending.source_player_id].death_reason or ""
        # 夜间产生的死亡技能（scope=continue，含夜里猎人对猎人的连锁反击）属于夜晚流程；
        # 白天（公投等）产生的死亡技能才进入白天阶段。
        is_night_context = pending.day_scope == "continue" or "夜间" in death_reason
        room.phase = "night_hunter" if is_night_context else "day_hunter"
        add_notice(room, f"{player_display_name(room, pending.source_player_id)} 触发了猎人技能。")
    elif pending.skill_type == "white_wolf_king_blast":
        room.phase = "day_white_wolf_king"
        add_notice(room, f"{player_display_name(room, pending.source_player_id)} 触发了白狼王技能。")


def start_last_words_or_discussion(room: RoomState) -> None:
    room.day.last_words_queue = [player_id for player_id in room.day.public_deaths]
    room.day.last_words_index = 0
    if room.day.last_words_queue:
        room.phase = "day_last_words"
        room.spotlight_id = room.day.last_words_queue[0]
        add_notice(room, "进入遗言阶段。")
        return
    start_day_discussion(room)


def start_day_discussion(room: RoomState) -> None:
    room.phase = "day_discussion"
    room.day.speech_queue = [player.player_id for player in ordered_players(room) if player.alive]
    room.day.speech_index = 0
    room.spotlight_id = room.day.speech_queue[0] if room.day.speech_queue else None
    add_notice(room, "进入白天顺序发言。")


def start_day_vote(room: RoomState) -> None:
    room.phase = "day_vote"
    room.spotlight_id = None
    room.day.votes.clear()
    room.day.vote_records.clear()
    room.day.vote_ranking.clear()
    room.day.abstain_count = 0
    room.day.vote_result_text = None
    room.day.eliminated_player_id = None
    add_notice(room, "发言结束，进入公投阶段。投票时限 20 秒，超时按弃票处理。")


def advance_last_words(room: RoomState, actor_id: str) -> None:
    current_id = current_last_words_speaker(room)
    if current_id is None or actor_id != current_id:
        raise ValueError("当前不是你的遗言回合。")
    room.day.last_words_index += 1
    next_id = current_last_words_speaker(room)
    if next_id is None:
        if room.day.last_words_scope == "discussion":
            start_day_discussion(room)
        else:
            room.spotlight_id = None
            room.round_number += 1
            begin_new_night(room)
    else:
        room.spotlight_id = next_id
        add_notice(room, f"轮到 {player_display_name(room, next_id)} 发表遗言。")
    refresh_voice_policy(room)


def advance_discussion(room: RoomState, actor_id: str, *, forced_by_host: bool = False) -> None:
    current_id = current_day_speaker(room)
    if current_id is None:
        raise ValueError("当前不在顺序发言阶段。")
    if actor_id != current_id and not forced_by_host:
        raise ValueError("当前不是你的发言回合。")
    room.day.speech_index += 1
    next_id = current_day_speaker(room)
    if next_id is None:
        start_day_vote(room)
    else:
        room.spotlight_id = next_id
        add_notice(room, f"轮到 {player_display_name(room, next_id)} 发言。")
    refresh_voice_policy(room)


def submit_vote(
    room: RoomState,
    actor_id: str,
    target_id: str | None,
    *,
    submitted_at: float | None = None,
) -> str:
    actor = room.players[actor_id]
    if room.phase != "day_vote" or not actor.alive:
        raise ValueError("当前不是你的投票回合。")
    if actor_id in room.day.votes:
        raise ValueError("你已经完成投票，当前选择已锁定。")
    if target_id is not None:
        if target_id not in room.players or not room.players[target_id].alive:
            raise ValueError("投票目标不存在或已出局。")
        if target_id == actor_id:
            raise ValueError("不能投给自己。")
    room.day.votes[actor_id] = target_id
    room.day.vote_records[actor_id] = {
        "actorId": actor_id,
        "actorName": actor.name,
        "actorDisplayName": player_display_name(room, actor),
        "actorNumber": actor.player_number,
        "targetId": target_id,
        "targetName": room.players[target_id].name if target_id else None,
        "targetDisplayName": player_display_name(room, target_id) if target_id else None,
        "targetNumber": room.players[target_id].player_number if target_id else None,
        "submittedAt": submitted_at,
        "locked": True,
    }
    alive_ids = {player.player_id for player in room.players.values() if player.alive}
    if alive_ids.issubset(room.day.votes.keys()):
        finalize_vote(room)
    return "已提交投票，当前选择已锁定。"


def fill_missing_votes_as_abstain(room: RoomState, *, submitted_at: float | None = None) -> int:
    created = 0
    for player in room.players.values():
        if not player.alive or player.player_id in room.day.votes:
            continue
        room.day.votes[player.player_id] = None
        room.day.vote_records[player.player_id] = {
            "actorId": player.player_id,
            "actorName": player.name,
            "actorDisplayName": player_display_name(room, player),
            "actorNumber": player.player_number,
            "targetId": None,
            "targetName": None,
            "targetDisplayName": None,
            "targetNumber": None,
            "submittedAt": submitted_at,
            "locked": True,
        }
        created += 1
    return created


def finalize_vote(room: RoomState) -> None:
    fill_missing_votes_as_abstain(room)
    counter: dict[str, int] = {}
    for target_id in room.day.votes.values():
        if target_id is None:
            continue
        counter[target_id] = counter.get(target_id, 0) + 1
    room.day.abstain_count = sum(1 for target_id in room.day.votes.values() if target_id is None)
    room.day.vote_ranking = [
        {
            "targetId": target_id,
            "targetName": room.players[target_id].name,
            "targetDisplayName": player_display_name(room, target_id),
            "targetNumber": room.players[target_id].player_number,
            "votes": votes,
        }
        for target_id, votes in sorted(
            counter.items(),
            key=lambda item: (-item[1], room.players[item[0]].joined_order, item[0]),
        )
    ]
    public_votes = sorted(
        room.day.vote_records.values(),
        key=lambda item: (
            float("inf") if item.get("submittedAt") is None else item.get("submittedAt"),
            item.get("actorId", ""),
        ),
    )
    room.last_vote_summary = {
        "roundNumber": room.round_number,
        "publicVotes": public_votes,
        "voteRanking": list(room.day.vote_ranking),
        "abstainCount": room.day.abstain_count,
        "eligibleVoterCount": sum(1 for player in room.players.values() if player.alive),
        "voteResultText": None,
    }
    if not counter:
        room.day.vote_result_text = f"所有人弃票，本轮无人出局。共 {room.day.abstain_count} 票弃票。"
        room.last_vote_summary["voteResultText"] = room.day.vote_result_text
        add_notice(room, room.day.vote_result_text)
        # 统一走结算入口：挂起的死亡技能先结算，再进入夜晚。
        continue_after_resolution(room, day_scope="next_night")
        refresh_voice_policy(room)
        return

    max_votes = max(counter.values())
    candidates = [target_id for target_id, count in counter.items() if count == max_votes]
    if len(candidates) != 1:
        room.day.vote_result_text = "公投平票，本轮无人出局。"
        room.last_vote_summary["voteResultText"] = room.day.vote_result_text
        add_notice(room, room.day.vote_result_text)
        continue_after_resolution(room, day_scope="next_night")
        refresh_voice_policy(room)
        return

    target_id = candidates[0]
    room.day.eliminated_player_id = target_id
    room.day.vote_result_text = f"{player_display_name(room, target_id)} 被公投出局。"
    room.last_vote_summary["voteResultText"] = room.day.vote_result_text
    add_notice(room, room.day.vote_result_text)
    mark_player_dead(room, target_id, "白天被公投出局")
    room.day.public_deaths = [target_id]
    room.day.last_words_scope = "next_night"
    maybe_queue_death_skills(room, [target_id], source_phase="vote")
    room.phase = "day_break"
    continue_after_resolution(room, day_scope="next_night")


def perform_hunter_shot(room: RoomState, actor_id: str, target_id: str) -> str:
    actor = room.players[actor_id]
    if room.phase not in {"night_hunter", "day_hunter"} or room.spotlight_id != actor_id:
        raise ValueError("当前不是猎人的技能回合。")
    if actor.hunter_shot_used:
        raise ValueError("猎人技能已经使用过了。")
    if target_id not in room.players or not room.players[target_id].alive:
        raise ValueError("猎人开枪目标不存在或已出局。")
    if target_id == actor_id:
        raise ValueError("不能对自己开枪。")
    actor.hunter_shot_used = True
    mark_player_dead(room, target_id, "被猎人带走")
    # 追加而不是覆盖：夜亡名单（包括猎人自己）必须保留，遗言按死亡顺序进行。
    if target_id not in room.day.public_deaths:
        room.day.public_deaths.append(target_id)
    # 夜间开枪打死的猎人要立即结算其反击；白天流程则挂到当天投票后（next_night）。
    maybe_queue_death_skills(
        room,
        [target_id],
        source_phase="night" if room.phase == "night_hunter" else "day_end",
    )
    add_notice(room, f"{player_display_name(room, actor)} 开枪带走了 {player_display_name(room, target_id)}。")
    room.spotlight_id = None
    if room.phase == "night_hunter":
        room.phase = "day_break"
        continue_after_resolution(room, day_scope="continue")
    else:
        # 白天开枪：回到公布死亡阶段，让所有白天死亡者（含被公投者）依次发表遗言。
        room.phase = "day_break"
        continue_after_resolution(room, day_scope="next_night")
    return "已完成开枪。"


def skip_hunter_shot(room: RoomState, actor_id: str) -> None:
    actor = room.players[actor_id]
    if room.phase not in {"night_hunter", "day_hunter"} or room.spotlight_id != actor_id:
        raise ValueError("当前不是猎人的技能回合。")
    actor.hunter_shot_used = True
    room.spotlight_id = None
    if room.phase == "night_hunter":
        room.phase = "day_break"
        continue_after_resolution(room, day_scope="continue")
    else:
        room.phase = "day_break"
        continue_after_resolution(room, day_scope="next_night")


def skip_guard(room: RoomState, actor_id: str) -> None:
    actor = room.players[actor_id]
    if room.phase != "night_guard" or not actor.alive or actor.role != "guard":
        raise ValueError("当前不是守卫的行动回合。")
    add_notice(room, "守卫本轮跳过守护。")
    advance_to_next_available_night_phase(room, from_phase="night_wolf_discussion")


def auto_abstain_wolf_votes(room: RoomState) -> None:
    """Fill missing wolf votes as abstain and resolve the night attack target."""
    if room.phase != "night_wolves":
        raise ValueError("当前不在狼人刀人阶段。")
    for wolf in wolves_in_room(room):
        if wolf.player_id not in room.night.wolf_votes:
            room.night.wolf_votes[wolf.player_id] = None
    room.night.attacked_player_id = resolve_wolf_target(room)
    add_notice(room, "狼人投票超时，未投票狼人已按弃票处理。")
    advance_to_next_available_night_phase(room, from_phase="night_seer")


def skip_seer(room: RoomState, actor_id: str) -> None:
    actor = room.players[actor_id]
    if room.phase != "night_seer" or not actor.alive or actor.role != "seer":
        raise ValueError("当前不是预言家的行动回合。")
    add_notice(room, "预言家本轮跳过查验。")
    advance_to_next_available_night_phase(room, from_phase="night_witch")


def skip_witch(room: RoomState, actor_id: str) -> None:
    actor = room.players[actor_id]
    if room.phase != "night_witch" or not actor.alive or actor.role != "witch":
        raise ValueError("当前不是女巫的行动回合。")
    room.night.witch_save = False
    room.night.witch_poison_target_id = None
    add_notice(room, "女巫行动结束，进入夜晚结算。")
    resolve_night(room)


def skip_white_wolf_king_blast(room: RoomState, actor_id: str) -> None:
    actor = room.players[actor_id]
    if room.phase != "day_white_wolf_king" or room.spotlight_id != actor_id:
        raise ValueError("当前不是白狼王的技能回合。")
    room.spotlight_id = None
    room.phase = "day_break"
    add_notice(room, f"{player_display_name(room, actor)} 超时未选择带人目标，技能按放弃处理。")
    continue_after_resolution(room, day_scope="next_night")


def perform_white_wolf_king_blast(room: RoomState, actor_id: str, target_id: str) -> str:
    actor = room.players[actor_id]
    if room.phase != "day_white_wolf_king" or room.spotlight_id != actor_id:
        raise ValueError("当前不是白狼王的技能回合。")
    if target_id not in room.players or not room.players[target_id].alive:
        raise ValueError("白狼王带人目标不存在或已出局。")
    if target_id == actor_id:
        raise ValueError("不能带走自己。")
    mark_player_dead(room, target_id, "被白狼王带走")
    if target_id not in room.day.public_deaths:
        room.day.public_deaths.append(target_id)
    maybe_queue_death_skills(room, [target_id], source_phase="day_end")
    room.spotlight_id = None
    room.phase = "day_break"
    add_notice(room, f"{player_display_name(room, actor)} 带走了 {player_display_name(room, target_id)}。")
    continue_after_resolution(room, day_scope="next_night")
    return "已完成白狼王带人。"


def perform_knight_duel(room: RoomState, actor_id: str, target_id: str) -> str:
    actor = room.players[actor_id]
    if room.phase != "day_discussion" or not actor.alive or actor.role != "knight":
        raise ValueError("当前不是骑士可发动技能的时机。")
    if room.spotlight_id != actor_id:
        raise ValueError("骑士只能在轮到自己发言时发动决斗。")
    if actor.knight_duel_used:
        raise ValueError("骑士技能已经使用过了。")
    if target_id not in room.players or not room.players[target_id].alive:
        raise ValueError("骑士决斗目标不存在或已出局。")
    if target_id == actor_id:
        raise ValueError("不能对自己发起决斗。")

    actor.knight_duel_used = True
    target = room.players[target_id]
    if player_team(target) == "wolf":
        mark_player_dead(room, target_id, "被骑士决斗击杀")
        remove_from_day_queue(room, target_id, "speech_queue", "speech_index")
        if target_id not in room.day.public_deaths:
            room.day.public_deaths.append(target_id)
        maybe_queue_death_skills(room, [target_id], source_phase="day_end")
        add_notice(room, f"{player_display_name(room, actor)} 决斗成功，{player_display_name(room, target)} 出局。")
        continue_after_resolution(room, day_scope="continue")
        return f"决斗成功，{player_display_name(room, target)} 是狼人阵营。"

    mark_player_dead(room, actor_id, "骑士决斗失败")
    if actor_id not in room.day.public_deaths:
        room.day.public_deaths.append(actor_id)
    maybe_queue_death_skills(room, [actor_id], source_phase="day_end")
    add_notice(room, f"{player_display_name(room, actor)} 决斗失败，自己出局，直接进入夜晚。")
    continue_after_resolution(room, day_scope="next_night")
    return f"决斗失败，{player_display_name(room, target)} 不是狼人阵营。"


def perform_self_destruct(room: RoomState, actor_id: str) -> str:
    actor = room.players[actor_id]
    if room.phase not in {"day_discussion", "day_vote"}:
        raise ValueError("当前阶段不能自爆。")
    if not room.allow_self_destruct:
        raise ValueError("房间未开启自爆机制。")
    if not actor.alive or player_team(actor) != "wolf":
        raise ValueError("只有存活的狼人可以自爆。")

    mark_player_dead(room, actor_id, "狼人自爆")
    # 自爆中断白天；先结算白狼王/猎人连锁，再直接入夜，不重复夜亡遗言。
    room.day.public_deaths = [actor_id]
    room.day.last_words_scope = "next_night"
    room.day.skip_last_words = True
    maybe_queue_death_skills(room, [actor_id], source_phase="self_destruct")
    add_notice(room, f"{player_display_name(room, actor)} 发动了自爆，当前白天立即结束。")
    continue_after_resolution(room, day_scope="next_night")
    return "已完成自爆。"


def remove_from_day_queue(room: RoomState, player_id: str, queue_name: str, index_name: str) -> None:
    """Remove a player from a DayState queue, keeping the walk index consistent."""
    queue = getattr(room.day, queue_name)
    if player_id not in queue:
        return
    index = getattr(room.day, index_name)
    removed_index = queue.index(player_id)
    queue.pop(removed_index)
    if removed_index < index:
        setattr(room.day, index_name, max(0, index - 1))


def remove_player_from_room(room: RoomState, player_id: str) -> None:
    if player_id not in room.players:
        return

    if room.phase == "ended":
        # 离场只改变房间成员，不改写最终胜负、已结算票型和日志。
        room.players.pop(player_id)
        refresh_voice_policy(room)
        return

    if room.spotlight_id == player_id:
        room.spotlight_id = None

    room.pending_skills = [
        pending for pending in room.pending_skills if pending.source_player_id != player_id
    ]

    remove_from_day_queue(room, player_id, "speech_queue", "speech_index")
    remove_from_day_queue(room, player_id, "last_words_queue", "last_words_index")

    room.day.public_deaths = [item for item in room.day.public_deaths if item != player_id]
    room.day.votes.pop(player_id, None)
    room.day.vote_records.pop(player_id, None)
    for voter_id, target_id in list(room.day.votes.items()):
        if target_id == player_id:
            room.day.votes[voter_id] = None
    for voter_id, record in list(room.day.vote_records.items()):
        if record.get("targetId") == player_id:
            room.day.vote_records[voter_id] = {
                **record,
                "targetId": None,
                "targetName": None,
                "targetDisplayName": None,
                "targetNumber": None,
            }
    if room.day.eliminated_player_id == player_id:
        room.day.eliminated_player_id = None
    room.day.vote_ranking = [
        item for item in room.day.vote_ranking if item.get("targetId") != player_id
    ]

    room.night.wolf_votes.pop(player_id, None)
    for wolf_id, target_id in list(room.night.wolf_votes.items()):
        if target_id == player_id:
            room.night.wolf_votes[wolf_id] = None
    if room.night.guard_target_id == player_id:
        room.night.guard_target_id = None
    if room.night.last_guard_target_id == player_id:
        room.night.last_guard_target_id = None
    if room.night.attacked_player_id == player_id:
        room.night.attacked_player_id = None
    if room.night.seer_target_id == player_id:
        room.night.seer_target_id = None
        room.night.seer_result = None
    if room.night.witch_poison_target_id == player_id:
        room.night.witch_poison_target_id = None
    room.night.deaths = [item for item in room.night.deaths if item != player_id]

    room.players.pop(player_id, None)
    if not room.players:
        return

    if not room.started:
        refresh_voice_policy(room)
        return

    if room.phase == "day_last_words":
        next_id = current_last_words_speaker(room)
        if next_id is None:
            if room.day.last_words_scope == "discussion":
                start_day_discussion(room)
            else:
                room.spotlight_id = None
                room.round_number += 1
                begin_new_night(room)
        else:
            room.spotlight_id = next_id
        if apply_winner_if_ready(room):
            return
        refresh_voice_policy(room)
        return

    if room.phase == "day_discussion":
        next_id = current_day_speaker(room)
        if next_id is None:
            start_day_vote(room)
        else:
            room.spotlight_id = next_id
        if apply_winner_if_ready(room):
            return
        refresh_voice_policy(room)
        return

    if room.phase == "day_vote":
        alive_ids = {player.player_id for player in room.players.values() if player.alive}
        if alive_ids and alive_ids.issubset(room.day.votes.keys()):
            finalize_vote(room)
            return
        if apply_winner_if_ready(room):
            return
        refresh_voice_policy(room)
        return

    if room.phase == "night_guard":
        guard_exists = any(player.alive and player.role == "guard" for player in room.players.values())
        if not guard_exists or room.spotlight_id not in room.players:
            advance_to_next_available_night_phase(room, from_phase="night_wolf_discussion")
            return

    if room.phase == "night_wolves":
        living_wolves = wolves_in_room(room)
        if not living_wolves or all(wolf.player_id in room.night.wolf_votes for wolf in living_wolves):
            room.night.attacked_player_id = resolve_wolf_target(room)
            advance_to_next_available_night_phase(room, from_phase="night_seer")
            return

    if room.phase == "night_seer":
        seer_exists = any(player.alive and player.role == "seer" for player in room.players.values())
        if not seer_exists or room.spotlight_id not in room.players:
            advance_to_next_available_night_phase(room, from_phase="night_witch")
            return

    if room.phase == "night_witch":
        witch_exists = any(player.alive and player.role == "witch" for player in room.players.values())
        if not witch_exists or room.spotlight_id not in room.players:
            resolve_night(room)
            return

    if room.phase == "night_hunter":
        if room.spotlight_id not in room.players:
            room.phase = "day_break"
            continue_after_resolution(room, day_scope="continue")
            return

    if room.phase in {"day_hunter", "day_white_wolf_king"}:
        if room.spotlight_id not in room.players:
            room.spotlight_id = None
            continue_after_resolution(room, day_scope="next_night")
            return

    if apply_winner_if_ready(room):
        return
    refresh_voice_policy(room)


def evaluate_winner(room: RoomState) -> str | None:
    living_wolves = wolves_in_room(room)
    if not living_wolves:
        return "good"

    living_villagers = living_good_players(room, "villager")
    living_gods = living_good_players(room, "god")
    if not living_villagers or not living_gods:
        return "wolf"
    return None


def self_view(room: RoomState, player_id: str) -> dict[str, Any]:
    player = room.players[player_id]
    refresh_player_numbers(room)
    candidates = [
        {
            "id": target.player_id,
            "name": target.name,
            "displayName": player_display_name(room, target),
            "playerNumber": target.player_number,
            "alive": target.alive,
            "roleVisible": role_label(visible_role_id(player, target, room)) if visible_role_id(player, target, room) else None,
        }
        for target in ordered_players(room)
    ]
    action_hints: list[dict[str, Any]] = []

    if room.phase == "night_guard" and player.alive and player.role == "guard":
        action_hints.append(
            {
                "type": "guard",
                "title": "守卫行动",
                "candidates": [target for target in candidates if target["alive"]],
            }
        )
    if room.phase == "night_wolves" and player.alive and player_team(player) == "wolf":
        action_hints.append(
            {
                "type": "wolf_vote",
                "title": "狼人刀人",
                "candidates": [
                    target
                    for target in candidates
                    if target["alive"] and player_team(room.players[target["id"]]) != "wolf"
                ],
                "voteCount": len(room.night.wolf_votes),
                "wolfCount": len(wolves_in_room(room)),
            }
        )
    if room.phase == "night_wolf_discussion" and player.alive and player_team(player) == "wolf":
        action_hints.append({"type": "wolf_chat", "title": "狼人密谈", "wolfChat": room.night.wolf_chat})
    if room.phase == "night_seer" and player.alive and player.role == "seer":
        action_hints.append(
            {
                "type": "seer",
                "title": "预言家验人",
                "candidates": [target for target in candidates if target["alive"] and target["id"] != player_id],
                "lastResult": player.inspected_result,
            }
        )
    if room.phase == "night_witch" and player.alive and player.role == "witch":
        action_hints.append(
            {
                "type": "witch",
                "title": "女巫用药",
                "attackedPlayerId": room.night.attacked_player_id,
                "attackedPlayerName": room.players[room.night.attacked_player_id].name if room.night.attacked_player_id else None,
                "attackedPlayerDisplayName": player_display_name(room, room.night.attacked_player_id) if room.night.attacked_player_id else None,
                "canSave": room.night.attacked_player_id is not None and not player.witch_antidote_used,
                "canPoison": not player.witch_poison_used,
                "candidates": [target for target in candidates if target["alive"] and target["id"] != player_id],
            }
        )
    if room.phase == "day_discussion" and player.alive and current_day_speaker(room) == player_id:
        action_hints.append({"type": "end_speech", "title": "结束你的发言"})
    if room.phase == "day_last_words" and current_last_words_speaker(room) == player_id:
        action_hints.append({"type": "end_last_words", "title": "结束你的遗言"})
    if room.phase == "day_vote" and player.alive:
        action_hints.append(
            {
                "type": "vote",
                "title": "公投出局",
                "candidates": [target for target in candidates if target["alive"] and target["id"] != player_id],
                "hasSubmitted": player_id in room.day.votes,
                "submittedTargetId": room.day.votes.get(player_id),
                "submittedTargetName": (
                    room.players[room.day.votes[player_id]].name
                    if room.day.votes.get(player_id)
                    else ("弃票" if player_id in room.day.votes else None)
                ),
                "submittedTargetDisplayName": (
                    player_display_name(room, room.day.votes[player_id])
                    if room.day.votes.get(player_id)
                    else ("弃票" if player_id in room.day.votes else None)
                ),
            }
        )
    if room.phase in {"night_hunter", "day_hunter"} and room.spotlight_id == player_id:
        action_hints.append(
            {
                "type": "hunter_shot",
                "title": "猎人开枪",
                "candidates": [target for target in candidates if target["alive"] and target["id"] != player_id],
            }
        )
    if room.phase == "day_white_wolf_king" and room.spotlight_id == player_id:
        action_hints.append(
            {
                "type": "white_wolf_king_blast",
                "title": "白狼王带人",
                "candidates": [target for target in candidates if target["alive"] and target["id"] != player_id],
            }
        )
    if (
        room.phase == "day_discussion"
        and player.alive
        and player.role == "knight"
        and room.spotlight_id == player_id
        and not player.knight_duel_used
    ):
        action_hints.append(
            {
                "type": "knight_duel",
                "title": "骑士决斗",
                "candidates": [target for target in candidates if target["alive"] and target["id"] != player_id],
            }
        )
    if (
        room.phase in {"day_discussion", "day_vote"}
        and room.allow_self_destruct
        and player.alive
        and player_team(player) == "wolf"
    ):
        action_hints.append({"type": "self_destruct", "title": "狼人自爆"})

    return {
        "roleId": player.role,
        "roleLabel": role_label(player.role),
        "inspectedResult": player.inspected_result,
        "actionHints": action_hints,
    }


def public_death_reason(room: RoomState, player: PlayerState) -> str | None:
    reason = player.death_reason
    if room.phase != "ended" and reason and (
        "夜间被狼人击杀" in reason or "被女巫毒杀" in reason
    ):
        return "夜间出局"
    return reason


def room_payload(room: RoomState, viewer_id: str) -> dict[str, Any]:
    refresh_player_numbers(room)
    viewer = room.players[viewer_id]
    players = []
    for player in ordered_players(room):
        visible_role = visible_role_id(viewer, player, room)
        voice_visible = can_exchange_voice(room, viewer_id, player.player_id)
        players.append(
            {
                "id": player.player_id,
                "name": player.name,
                "displayName": player_display_name(room, player),
                "playerNumber": player.player_number,
                "joinedOrder": player.joined_order,
                "alive": player.alive,
                "deathReason": public_death_reason(room, player),
                "isHost": player.player_id == room.host_id,
                "isBot": player.is_bot,
                "connected": player.connected,
                "role": role_label(visible_role) if visible_role else None,
                "team": "狼人阵营" if visible_role and ROLE_META[visible_role]["team"] == "wolf" else ("好人阵营" if visible_role else None),
                "voice": {
                    "manualOpen": player.voice_manual_open if voice_visible else False,
                    "effectiveOpen": player.voice_effective_open if voice_visible else False,
                    "speaking": voice_visible and player.voice_speaking and player.voice_effective_open,
                    "volume": round(player.voice_volume, 3) if voice_visible else 0,
                    "mutedByHost": player.host_muted,
                    "blacklistedByHost": player.host_blacklisted,
                },
            }
        )

    return {
        "roomCode": room.code,
        "selfId": viewer_id,
        "hostId": room.host_id,
        "started": room.started,
        "phase": room.phase,
        "phaseLabel": phase_label(room.phase),
        "roundNumber": room.round_number,
        "spotlightId": visible_spotlight_id(room, viewer_id),
        "voicePeerIds": [p.player_id for p in ordered_players(room)
                         if p.player_id != viewer_id and not p.is_bot and p.connected
                         and can_exchange_voice(room, viewer_id, p.player_id)],
        "voiceEpoch": f"{room.round_number}:{room.phase}",
        "winner": room.winner,
        "winnerLabel": room.winner_label,
        "config": {
            "preset": room.config_preset,
            "presetLabel": PRESET_LABELS[room.config_preset],
            "roles": preset_labels(room.config_preset),
            "rulebook": preset_rulebook(room.config_preset),
            "allowSelfDestruct": room.allow_self_destruct,
            "enableAiMode": room.enable_ai_mode,
            "requiredPlayers": len(ROLE_PRESETS[room.config_preset]),
        },
        "day": {
            "publicDeaths": room.day.public_deaths,
            "voteResultText": room.day.vote_result_text,
            "currentSpeakerId": current_day_speaker(room),
            "currentLastWordsSpeakerId": current_last_words_speaker(room),
            "publicVotes": sorted(
                room.day.vote_records.values(),
                key=lambda item: (
                    float("inf") if item.get("submittedAt") is None else item.get("submittedAt"),
                    item.get("actorId", ""),
                ),
            ),
            "voteRanking": room.day.vote_ranking,
            "abstainCount": room.day.abstain_count,
            "eligibleVoterCount": sum(1 for player in room.players.values() if player.alive),
        },
        "voteSummary": room.last_vote_summary,
        "selfView": self_view(room, viewer_id),
        "players": players,
        "notices": room.notice_log[:30],
    }
