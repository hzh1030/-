const RESUME_TOKEN_STORAGE_KEY = "lanWerewolfSessionToken";
const LAST_ROOM_STORAGE_KEY = "lanWerewolfLastRoom";

function generateResumeToken() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `resume-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

function loadResumeToken() {
  const existing = window.localStorage.getItem(RESUME_TOKEN_STORAGE_KEY);
  if (existing) {
    return existing;
  }
  const token = generateResumeToken();
  window.localStorage.setItem(RESUME_TOKEN_STORAGE_KEY, token);
  return token;
}

function loadLastRoomCode() {
  return window.localStorage.getItem(LAST_ROOM_STORAGE_KEY) || null;
}

const state = {
  socket: null,
  connected: false,
  sessionReplaced: false,
  roomCode: loadLastRoomCode(),
  selfId: null,
  hostId: null,
  started: false,
  phase: "lobby",
  phaseLabel: "准备阶段",
  roundNumber: 0,
  winnerLabel: null,
  players: [],
  config: null,
  speechTimer: null,
  voteTimer: null,
  day: {},
  voteSummary: null,
  selfView: { roleLabel: "未分配", actionHints: [] },
  notices: [],
  ephemeralNotices: [],
  skillTimer: null,
  wolfDiscussionTimer: null,
  resumeAttempts: 0,
  resumePending: false,
  lastUnavailableNoticeAt: 0,
  syncedConfigPreset: null,
  syncedAllowSelfDestruct: null,
  syncedEnableAiMode: null,
  roomAccess: null,
  discoverableRooms: [],
  presetCatalog: [],
  rulesTrigger: null,
  localStream: null,
  peers: new Map(),
  voicePeerIds: [],
  voiceEpoch: null,
  rtcConfiguration: { iceServers: [], iceTransportPolicy: "all" },
  wolfChatDraft: "",
  audioContext: null,
  analyser: null,
  meterTimer: null,
  manualMicOpen: false,
  awaitingJoinMicOpen: false,
  resumeToken: loadResumeToken(),
  actionDrafts: {},
  actionPanelSignature: "",
  installPrompt: null,
  transitionQueue: [],
  transitionRunning: false,
  transitionGeneration: 0,
  network: {
    rttMs: null,
    rttSamples: [],
    failures: 0,
    probeSequence: 0,
    pendingProbe: null,
    probeTimer: null,
    probeTimeout: null,
    voiceTimer: null,
    monitorSocket: null,
    lastQualityKey: null,
    lastNoticeAt: 0,
    voiceCollecting: false,
    voice: {
      active: false,
      peerCount: 0,
      supported: true,
      hasSamples: false,
      lossPercent: null,
      jitterMs: null,
      previousSamples: new Map(),
    },
  },
};

const KNOWN_WOLF_ROLES = new Set(["狼人", "白狼王"]);
const KNOWN_GOOD_ROLES = new Set(["平民", "预言家", "女巫", "猎人", "守卫", "骑士"]);
const NETWORK_PROBE_INTERVAL_MS = 1000;
const NETWORK_PROBE_TIMEOUT_MS = 3000;
const VOICE_NETWORK_SAMPLE_INTERVAL_MS = 2000;
const RESUME_MAX_ATTEMPTS = 6;
const RESUME_RETRY_BASE_MS = 1500;
const EPHEMERAL_NOTICE_TTL_MS = 60000;
const networkQualityTools = window.WerewolfNetworkQuality || {
  buildNetworkPresentation({ connected, rttMs }) {
    const online = Boolean(connected);
    const hasRtt = rttMs !== null && rttMs !== undefined && Number.isFinite(Number(rttMs));
    const key = online ? (hasRtt ? "good" : "checking") : "offline";
    return {
      overall: { key, bars: key === "good" ? 3 : 0 },
      label: online ? (hasRtt ? "网络良好" : "网络检测中") : "网络已断开",
      latencyText: online && hasRtt ? `${Math.max(1, Math.round(Number(rttMs)))} ms` : "-- ms",
      voiceText: "语音统计加载中",
    };
  },
  deriveVoiceSample({ packetsLost, deliveredPackets, jitterMs }, previous) {
    const loss = Number(packetsLost);
    const delivered = Number(deliveredPackets);
    const jitter = Number(jitterMs);
    let lossPercent = null;
    if (
      previous
      && Number.isFinite(loss)
      && Number.isFinite(delivered)
      && Number.isFinite(previous.packetsLost)
      && Number.isFinite(previous.deliveredPackets)
    ) {
      const lostDelta = loss - previous.packetsLost;
      const deliveredDelta = delivered - previous.deliveredPackets;
      if (lostDelta >= 0 && deliveredDelta >= 0 && lostDelta + deliveredDelta > 0) {
        lossPercent = (lostDelta / (lostDelta + deliveredDelta)) * 100;
      }
    }
    return { lossPercent, jitterMs: Number.isFinite(jitter) ? jitter : null };
  },
};

const els = {
  lobbyView: document.querySelector("#lobbyView"),
  battleView: document.querySelector("#battleView"),
  connectionStatus: document.querySelector("#connectionStatus"),
  roomCodeValue: document.querySelector("#roomCodeValue"),
  phaseValue: document.querySelector("#phaseValue"),
  roundValue: document.querySelector("#roundValue"),
  roleValue: document.querySelector("#roleValue"),
  micPolicyValue: document.querySelector("#micPolicyValue"),
  speechTimerValue: document.querySelector("#speechTimerValue"),
  winnerValue: document.querySelector("#winnerValue"),
  nameInput: document.querySelector("#nameInput"),
  roomCodeInput: document.querySelector("#roomCodeInput"),
  presetSelect: document.querySelector("#presetSelect"),
  presetRulesBtn: document.querySelector("#presetRulesBtn"),
  altarRulesBtn: document.querySelector("#altarRulesBtn"),
  tabletopScriptCount: document.querySelector("#tabletopScriptCount"),
  tabletopScriptLabel: document.querySelector("#tabletopScriptLabel"),
  tabletopScriptComposition: document.querySelector("#tabletopScriptComposition"),
  selfDestructInput: document.querySelector("#selfDestructInput"),
  aiModeInput: document.querySelector("#aiModeInput"),
  createRoomBtn: document.querySelector("#createRoomBtn"),
  joinRoomBtn: document.querySelector("#joinRoomBtn"),
  enableVoiceBtn: document.querySelector("#enableVoiceBtn"),
  manualMicBtn: document.querySelector("#manualMicBtn"),
  leaveRoomBtn: document.querySelector("#leaveRoomBtn"),
  tabletopQrTicket: document.querySelector("#tabletopQrTicket"),
  roomQrImage: document.querySelector("#roomQrImage"),
  joinUrlValue: document.querySelector("#joinUrlValue"),
  mobilePlayHint: document.querySelector("#mobilePlayHint"),
  mobileJoinLink: document.querySelector("#mobileJoinLink"),
  shareRoomBtn: document.querySelector("#shareRoomBtn"),
  installGameBtn: document.querySelector("#installGameBtn"),
  configSummary: document.querySelector("#configSummary"),
  startGameBtn: document.querySelector("#startGameBtn"),
  forceNextSpeechBtn: document.querySelector("#forceNextSpeechBtn"),
  syncStateBtn: document.querySelector("#syncStateBtn"),
  saveConfigBtn: document.querySelector("#saveConfigBtn"),
  hostPresetSelect: document.querySelector("#hostPresetSelect"),
  hostPresetRulesBtn: document.querySelector("#hostPresetRulesBtn"),
  hostSelfDestructInput: document.querySelector("#hostSelfDestructInput"),
  hostAiModeInput: document.querySelector("#hostAiModeInput"),
  hostControls: document.querySelector("#hostControls"),
  hostHint: document.querySelector("#hostHint"),
  actionPanel: document.querySelector("#actionPanel"),
  discoveryList: document.querySelector("#discoveryList"),
  playersList: document.querySelector("#playersList"),
  noticeLog: document.querySelector("#noticeLog"),
  battleStageSummary: document.querySelector("#battleStageSummary"),
  battleRoomCodeValue: document.querySelector("#battleRoomCodeValue"),
  battlePhaseValue: document.querySelector("#battlePhaseValue"),
  battleRoundValue: document.querySelector("#battleRoundValue"),
  battleRoleValue: document.querySelector("#battleRoleValue"),
  battleSpeechTimerValue: document.querySelector("#battleSpeechTimerValue"),
  battlePresetRulesBtn: document.querySelector("#battlePresetRulesBtn"),
  battlePresetLabel: document.querySelector("#battlePresetLabel"),
  battleLeaveRoomBtn: document.querySelector("#battleLeaveRoomBtn"),
  battleHostControls: document.querySelector("#battleHostControls"),
  battleForceNextSpeechBtn: document.querySelector("#battleForceNextSpeechBtn"),
  battleSyncStateBtn: document.querySelector("#battleSyncStateBtn"),
  votePanelSummary: document.querySelector("#votePanelSummary"),
  votePanelRanking: document.querySelector("#votePanelRanking"),
  votePanelRecords: document.querySelector("#votePanelRecords"),
  battleLeftHint: document.querySelector("#battleLeftHint"),
  battleRightHint: document.querySelector("#battleRightHint"),
  battleLeftCount: document.querySelector("#battleLeftCount"),
  battleRightCount: document.querySelector("#battleRightCount"),
  battleLeftPlayers: document.querySelector("#battleLeftPlayers"),
  battleRightPlayers: document.querySelector("#battleRightPlayers"),
  battleTablePlayers: document.querySelector("#battleTablePlayers"),
  battleTablePhase: document.querySelector("#battleTablePhase"),
  battleTableCount: document.querySelector("#battleTableCount"),
  battleTablePrompt: document.querySelector("#battleTablePrompt"),
  battleActionPanel: document.querySelector("#battleActionPanel"),
  battleNoticeLog: document.querySelector("#battleNoticeLog"),
  remoteAudioBucket: document.querySelector("#remoteAudioBucket"),
  phaseTransitionOverlay: document.querySelector("#phaseTransitionOverlay"),
  phaseTransitionKicker: document.querySelector("#phaseTransitionKicker"),
  phaseTransitionTitle: document.querySelector("#phaseTransitionTitle"),
  phaseTransitionSubtitle: document.querySelector("#phaseTransitionSubtitle"),
  presetRulesOverlay: document.querySelector("#presetRulesOverlay"),
  presetRulesPanel: document.querySelector("#presetRulesPanel"),
  presetRulesClose: document.querySelector("#presetRulesClose"),
  presetRulesKicker: document.querySelector("#presetRulesKicker"),
  presetRulesTitle: document.querySelector("#presetRulesTitle"),
  presetRulesMeta: document.querySelector("#presetRulesMeta"),
  presetRulesSettings: document.querySelector("#presetRulesSettings"),
  presetRulesRoles: document.querySelector("#presetRulesRoles"),
  presetRulesFlow: document.querySelector("#presetRulesFlow"),
  presetRulesVictory: document.querySelector("#presetRulesVictory"),
  presetRulesInformation: document.querySelector("#presetRulesInformation"),
  bootSplash: document.querySelector("#bootSplash"),
  skipBootBtn: document.querySelector("#skipBootBtn"),
  networkHealth: document.querySelector("#networkHealth"),
  networkHealthLabel: document.querySelector("#networkHealthLabel"),
  networkLatencyValue: document.querySelector("#networkLatencyValue"),
  networkLatencyTrend: document.querySelector("#networkLatencyTrend path"),
  networkSignalBars: document.querySelector("#networkSignalBars"),
  voiceNetworkValue: document.querySelector("#voiceNetworkValue"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function websocketUrl() {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/game/ws`;
}

function addNotice(message, { urgent = false } = {}) {
  // 本地提示与服务器 notice_log 分开保存：room_state 全量刷新 state.notices 时
  // 不会再冲掉错误提示/行动结果（如预言家验人结果）。
  state.ephemeralNotices.unshift({ text: message, at: Date.now() });
  state.ephemeralNotices = state.ephemeralNotices.slice(0, 12);
  renderNotices();
  if (urgent || /错误：|失败|不允许|不支持|不可用/.test(message)) {
    document.querySelector("#gameFeedbackText").textContent = message;
    document.querySelector("#gameFeedback").classList.remove("hidden");
  }
}

function currentPlayer() {
  return state.players.find((player) => player.id === state.selfId) || null;
}

function isHost() {
  return Boolean(state.selfId && state.selfId === state.hostId);
}

const RULE_TEAM_LABELS = {
  wolf: "狼人阵营",
  villager: "平民阵营",
  god: "神职阵营",
};

function isRulesOverlayOpen() {
  return Boolean(els.presetRulesOverlay && !els.presetRulesOverlay.classList.contains("hidden"));
}

function hasHostRulePreview() {
  return Boolean(state.roomCode && isHost() && !state.started);
}

function previewPresetKey() {
  if (hasHostRulePreview()) {
    return els.hostPresetSelect?.value || state.config?.preset || "standard";
  }
  if (state.config?.preset) {
    return state.config.preset;
  }
  return els.presetSelect?.value || "standard";
}

function rulebookForPreset(preset) {
  if (state.config?.preset === preset && state.config?.rulebook) {
    return state.config.rulebook;
  }
  return state.presetCatalog.find((item) => item?.preset === preset) || null;
}

function previewSelfDestructEnabled() {
  if (hasHostRulePreview()) {
    return Boolean(els.hostSelfDestructInput?.checked);
  }
  if (state.config) {
    return Boolean(state.config.allowSelfDestruct);
  }
  return Boolean(els.selfDestructInput?.checked);
}

function presetOptionLabel(preset) {
  const option = [...(els.presetSelect?.options || [])].find((item) => item.value === preset);
  return option?.textContent?.trim() || "当前板子";
}

function renderRuleList(element, items) {
  if (!element) {
    return;
  }
  element.innerHTML = (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderPresetRules() {
  if (!els.presetRulesTitle) {
    return;
  }
  const preset = previewPresetKey();
  const rulebook = rulebookForPreset(preset);
  const fallbackLabel = state.config?.preset === preset
    ? state.config.presetLabel
    : presetOptionLabel(preset);
  const buttonLabel = rulebook?.label || fallbackLabel || "规则说明";

  if (els.battlePresetLabel) {
    els.battlePresetLabel.textContent = state.config?.presetLabel || buttonLabel;
  }

  if (!rulebook) {
    els.presetRulesKicker.textContent = "CURRENT SCRIPT";
    els.presetRulesTitle.textContent = fallbackLabel || "当前板子规则";
    els.presetRulesMeta.textContent = "规则数据正在载入；创建或加入房间后会自动显示与实际引擎一致的规则。";
    els.presetRulesSettings.textContent = "";
    els.presetRulesRoles.innerHTML = "";
    renderRuleList(els.presetRulesFlow, []);
    renderRuleList(els.presetRulesVictory, []);
    renderRuleList(els.presetRulesInformation, []);
    return;
  }

  const campCounts = rulebook.campCounts || {};
  const composition = [
    ["wolf", "狼"],
    ["villager", "民"],
    ["god", "神"],
  ]
    .filter(([team]) => Number(campCounts[team]) > 0)
    .map(([team, suffix]) => `${Number(campCounts[team])} ${suffix}`)
    .join(" · ");
  const selfDestructText = previewSelfDestructEnabled()
    ? "狼人自爆：已开启。存活狼人可在白天发言或公投阶段自爆，白天立即结束；白狼王自爆会触发带人。"
    : "狼人自爆：本房间未开启，狼人不能主动自爆。";

  els.presetRulesKicker.textContent = `CURRENT SCRIPT · ${Number(rulebook.playerCount) || "?"} PLAYERS`;
  els.presetRulesTitle.textContent = rulebook.label || fallbackLabel || "当前板子规则";
  els.presetRulesMeta.textContent = `${Number(rulebook.playerCount) || "?"} 人局 · ${composition || "阵营信息"}`;
  els.presetRulesSettings.innerHTML = `<span class="preset-rules-setting-dot" aria-hidden="true"></span><span>${escapeHtml(selfDestructText)}</span>`;
  els.presetRulesRoles.innerHTML = (rulebook.roles || []).map((role) => {
    const team = RULE_TEAM_LABELS[role.team] || "未知阵营";
    const teamClass = ["wolf", "villager", "god"].includes(role.team) ? role.team : "unknown";
    return `
      <article class="preset-rule-role team-${teamClass}">
        <div class="preset-rule-role-head">
          <span>${escapeHtml(team)}</span>
          <strong>${escapeHtml(role.label)} × ${escapeHtml(Number(role.count) || 0)}</strong>
        </div>
        <p>${escapeHtml(role.ability)}</p>
        <small>${escapeHtml(role.limits)}</small>
      </article>
    `;
  }).join("");
  renderRuleList(els.presetRulesFlow, rulebook.flow);
  renderRuleList(els.presetRulesVictory, rulebook.victory);
  renderRuleList(els.presetRulesInformation, rulebook.information);
}

function renderTabletopScriptPreview() {
  if (!els.tabletopScriptLabel) {
    return;
  }
  const preset = previewPresetKey();
  const rulebook = rulebookForPreset(preset);
  const fallbackLabel = state.config?.preset === preset
    ? state.config.presetLabel
    : presetOptionLabel(preset);
  const label = rulebook?.label || fallbackLabel || "当前板子";
  const playerCount = Number(rulebook?.playerCount)
    || Number(state.config?.requiredPlayers)
    || Number((label.match(/\d+/) || [])[0])
    || 0;
  const campCounts = rulebook?.campCounts || {};
  const composition = [
    ["wolf", "狼"],
    ["villager", "民"],
    ["god", "神"],
  ]
    .filter(([team]) => Number(campCounts[team]) > 0)
    .map(([team, suffix]) => `${Number(campCounts[team])} ${suffix}`)
    .join(" · ");

  els.tabletopScriptCount.textContent = playerCount ? `${playerCount} 人局` : "等待选板";
  els.tabletopScriptLabel.textContent = preset === "standard" ? "12 人标准局" : label.replace(/（.*?）/g, "").trim();
  els.tabletopScriptComposition.textContent = composition || "等待房间配置";
  renderCastleLobby();
}

function mountCastleLobby() {
  const target = document.querySelector("#castleJoinedControls");
  if (!target) return;
  const hostPanel = document.querySelector(".tabletop-host-panel");
  const playersPanel = document.querySelector(".tabletop-players-panel");
  if (hostPanel) target.append(hostPanel);
  if (playersPanel) document.querySelector("#castleLobbyPlayers").append(playersPanel);
  const inviteCard = document.querySelector('.tabletop-qr-dock');
  if (inviteCard) target.insertBefore(inviteCard, hostPanel || null);
  document.querySelector("#castleFooterShare").append(els.shareRoomBtn);
}

function renderCastleLobby() {
  const form = document.querySelector("#castleSetupForm");
  if (!form) return;
  const joined = Boolean(state.roomCode && state.selfId);
  els.lobbyView.classList.toggle("is-in-room", joined);
  document.body.classList.toggle("has-voice", Boolean(state.localStream));
  form.classList.toggle("hidden", joined);
  document.querySelector("#castleJoinedControls").classList.toggle("hidden", !joined);
  document.querySelector("#castleLobbyPlayers").classList.toggle("hidden", !joined);
  document.querySelector("#castleRoomCode").textContent = joined ? state.roomCode : "";
  document.querySelector("#castleRoomCount").textContent = joined
    ? `${state.players.length} / ${state.config?.requiredPlayers || 12} 人已落座 · ${state.config?.enableAiMode ? "人机模式" : "好友对局"}` : "";
  document.querySelector("#castleRoomStatus").textContent = joined ? `房间 ${state.roomCode}` : "尚未加入房间";
  els.shareRoomBtn.textContent = joined ? "邀请好友 ↗" : "建房后生成邀请链接";
  const notice = document.querySelector("#castleLastNotice");
  notice.textContent = state.ephemeralNotices[0]?.text || "在线联机 · 扫码或房间号加入";
  notice.title = notice.textContent;
  const preset = previewPresetKey();
  const count = Number(rulebookForPreset(preset)?.playerCount) || Number(els.tabletopScriptCount.textContent.match(/\d+/)?.[0]);
  document.querySelectorAll("[data-castle-preset]").forEach(button => {
    const active = button.dataset.castlePreset === preset;
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
    button.disabled = joined;
  });
  document.querySelectorAll("[data-castle-count]").forEach(button => {
    button.setAttribute("aria-pressed", String(Number(button.dataset.castleCount) === count));
    button.disabled = joined;
  });
}

function openPresetRules(trigger = document.activeElement) {
  if (!els.presetRulesOverlay) {
    return;
  }
  state.rulesTrigger = trigger instanceof HTMLElement ? trigger : null;
  renderPresetRules();
  els.presetRulesOverlay.classList.remove("hidden");
  els.presetRulesOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-preset-rules-modal");
  window.requestAnimationFrame(() => els.presetRulesClose?.focus());
}

function closePresetRules() {
  if (!isRulesOverlayOpen()) {
    return;
  }
  els.presetRulesOverlay.classList.add("hidden");
  els.presetRulesOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-preset-rules-modal");
  const trigger = state.rulesTrigger;
  state.rulesTrigger = null;
  if (trigger?.isConnected) {
    window.requestAnimationFrame(() => trigger.focus());
  }
}

function compareIds(left, right) {
  return left.localeCompare(right);
}

function playerSequenceNumber(player) {
  return Number(player?.playerNumber || 0);
}

function comparePlayerSequence(left, right) {
  const numberDiff = playerSequenceNumber(left) - playerSequenceNumber(right);
  if (numberDiff !== 0) {
    return numberDiff;
  }
  return compareIds(left.id || "", right.id || "");
}

function displayPlayerName(player, options = {}) {
  const { includeSelf = false } = options;
  const baseName = player?.displayName || player?.name || "未知玩家";
  return `${baseName}${includeSelf && player?.id === state.selfId ? "（你）" : ""}`;
}

function displayCandidateName(candidate) {
  return candidate?.displayName || candidate?.name || "未知目标";
}

function renderPlayerNumberBadge(player, className = "") {
  const classes = ["player-number-badge", className].filter(Boolean).join(" ");
  return `<span class="${classes}">#${escapeHtml(playerSequenceNumber(player) || "?")}</span>`;
}

function resetRoomState(clearStoredRoom = true) {
  state.wolfChatDraft = "";
  state.voicePeerIds = [];
  state.voiceEpoch = null;
  state.roomCode = clearStoredRoom ? null : state.roomCode;
  state.selfId = null;
  state.hostId = null;
  state.started = false;
  state.phase = "lobby";
  state.phaseLabel = "准备阶段";
  state.roundNumber = 0;
  state.winnerLabel = null;
  state.players = [];
  state.config = null;
  state.speechTimer = null;
  state.voteTimer = null;
  state.skillTimer = null;
  state.wolfDiscussionTimer = null;
  state.day = {};
  state.voteSummary = null;
  state.selfView = { roleLabel: "未分配", actionHints: [] };
  state.notices = [];
  state.ephemeralNotices = [];
  state.resumePending = false;
  state.resumeAttempts = 0;
  state.syncedConfigPreset = null;
  state.syncedAllowSelfDestruct = null;
  state.syncedEnableAiMode = null;
  state.roomAccess = null;
  state.actionDrafts = {};
  state.actionPanelSignature = "";
  state.transitionQueue = [];
  state.transitionRunning = false;
  state.transitionGeneration += 1;
  els.phaseTransitionOverlay?.classList.add("hidden");
  if (clearStoredRoom) {
    window.localStorage.removeItem(LAST_ROOM_STORAGE_KEY);
  }
  cleanupAllPeers();
}

function formatSpeechCountdown() {
  const timer = state.speechTimer;
  if (!timer?.endsAt || !state.started) {
    return "未开始";
  }
  const remaining = Math.max(0, Math.ceil(timer.endsAt - Date.now() / 1000));
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatVoteCountdown() {
  const timer = state.voteTimer;
  if (!timer?.endsAt || state.phase !== "day_vote") {
    return "已结束";
  }
  const remaining = Math.max(0, Math.ceil(timer.endsAt - Date.now() / 1000));
  const seconds = String(remaining).padStart(2, "0");
  return `00:${seconds}`;
}

function formatSkillCountdown() {
  const timer = state.skillTimer;
  if (!timer?.endsAt) {
    return "";
  }
  const remaining = Math.max(0, Math.ceil(timer.endsAt - Date.now() / 1000));
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatWolfDiscussionCountdown() {
  const timer = state.wolfDiscussionTimer;
  if (!timer?.endsAt) {
    return "";
  }
  const remaining = Math.max(0, Math.ceil(timer.endsAt - Date.now() / 1000));
  return `剩余 ${remaining} 秒后自动选刀`;
}

function formatPrimaryTimer() {
  if (state.phase === "day_vote" && state.voteTimer?.endsAt) {
    return `${formatVoteCountdown()}（公投）`;
  }
  if (state.speechTimer?.endsAt) {
    return formatSpeechCountdown();
  }
  if (state.skillTimer?.endsAt) {
    return `${formatSkillCountdown()}（行动时限）`;
  }
  return "未开始";
}

function formatVoteTimestamp(timestamp) {
  if (!timestamp) {
    return "系统补记";
  }
  return new Date(timestamp * 1000).toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function computeVoteRanking(voteRecords) {
  const counter = new Map();
  for (const record of voteRecords || []) {
    if (!record.targetId) {
      continue;
    }
    const current = counter.get(record.targetId) || {
      targetId: record.targetId,
      targetName: record.targetName,
      targetDisplayName: record.targetDisplayName || record.targetName,
      votes: 0,
    };
    current.votes += 1;
    counter.set(record.targetId, current);
  }
  return [...counter.values()].sort((left, right) => right.votes - left.votes || (left.targetDisplayName || left.targetName).localeCompare(right.targetDisplayName || right.targetName, "zh-CN"));
}

function currentVoteSnapshot() {
  if (state.phase === "day_vote") {
    const publicVotes = state.day?.publicVotes || [];
    return {
      roundNumber: state.roundNumber,
      publicVotes,
      voteRanking: computeVoteRanking(publicVotes),
      abstainCount: publicVotes.filter((record) => !record.targetId).length,
      eligibleVoterCount: state.voteTimer?.eligibleVoterCount || state.day?.eligibleVoterCount || 0,
      voteResultText: state.day?.voteResultText || null,
      submittedCount: publicVotes.length,
    };
  }
  if (state.voteSummary) {
    return {
      ...state.voteSummary,
      submittedCount: state.voteSummary.publicVotes?.length || 0,
    };
  }
  return null;
}

function isBattleView() {
  return Boolean(state.started);
}

function playerPhaseSpotlight(player) {
  return player.id === state.day?.currentSpeakerId || player.id === state.day?.currentLastWordsSpeakerId;
}

function playerCamp(player) {
  if (player.team === "狼人阵营") {
    return { kind: "wolf", label: "狼人阵营" };
  }
  if (player.team === "好人阵营") {
    return { kind: "good", label: "好人阵营" };
  }
  if (KNOWN_WOLF_ROLES.has(player.role)) {
    return { kind: "wolf", label: "狼人阵营" };
  }
  if (KNOWN_GOOD_ROLES.has(player.role)) {
    return { kind: "good", label: "好人阵营" };
  }
  return { kind: "unknown", label: "待识别" };
}

function battlePlayerRank(player) {
  let score = 0;
  if (player.id === state.selfId) score += 1000;
  if (playerPhaseSpotlight(player)) score += 500;
  if (player.isHost) score += 200;
  if (player.alive) score += 100;
  return score;
}

function sortPlayersForBattle(players) {
  return [...players].sort((left, right) => {
    const scoreDiff = battlePlayerRank(right) - battlePlayerRank(left);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    return comparePlayerSequence(left, right);
  });
}

function splitBattleSides(players) {
  const left = [];
  const right = [];
  for (const player of sortPlayersForBattle(players)) {
    const camp = playerCamp(player);
    const entry = { ...player, camp };
    if (camp.kind === "wolf") {
      left.push(entry);
      continue;
    }
    if (camp.kind === "good") {
      right.push(entry);
      continue;
    }
    if (left.length <= right.length) {
      left.push(entry);
    } else {
      right.push(entry);
    }
  }
  return { left, right };
}

function avatarText(name) {
  const cleaned = String(name || "").trim();
  return escapeHtml(cleaned ? cleaned.slice(0, 1).toUpperCase() : "?");
}

function sendMessage(type, payload = {}) {
  if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
    // 断线期间音量计等高频调用会持续失败：节流提示，避免刷屏挤掉真实消息。
    const now = Date.now();
    if (!state.lastUnavailableNoticeAt || now - state.lastUnavailableNoticeAt > 5000) {
      state.lastUnavailableNoticeAt = now;
      addNotice("当前还没有连接到房间服务。");
    }
    return;
  }
  state.socket.send(JSON.stringify({ type, ...payload }));
}

function createVoiceNetworkState() {
  return {
    active: Boolean(state.localStream),
    peerCount: state.peers.size,
    supported: typeof window.RTCPeerConnection === "function",
    hasSamples: false,
    lossPercent: null,
    jitterMs: null,
    previousSamples: new Map(),
  };
}

function networkNowMs() {
  return typeof window.performance?.now === "function" ? window.performance.now() : Date.now();
}

function currentNetworkPresentation() {
  const pending = state.network.pendingProbe;
  const elapsed = pending ? Math.max(0, networkNowMs() - pending.startedAt) : 0;
  return networkQualityTools.buildNetworkPresentation({
    connected: state.connected,
    rttMs: state.network.rttMs,
    failures: state.network.failures,
    waitingMs: elapsed >= NETWORK_PROBE_INTERVAL_MS ? elapsed : null,
    voice: state.network.voice,
  });
}

function renderNetworkHealth() {
  if (!els.networkHealth) {
    return null;
  }

  const presentation = currentNetworkPresentation();
  const qualityKey = presentation.overall?.key || "checking";
  const qualityChanged = els.networkHealth.dataset.quality !== qualityKey;
  els.networkHealth.dataset.quality = qualityKey;
  els.networkHealth.className = `network-health is-${qualityKey}`;
  els.networkHealth.setAttribute("aria-live", qualityChanged ? "polite" : "off");
  els.networkHealthLabel.textContent = presentation.label;
  els.networkLatencyValue.textContent = presentation.latencyText;
  els.voiceNetworkValue.textContent = presentation.voiceText;
  const trend = networkQualityTools.buildLatencyTrend?.(state.network.rttSamples);
  if (els.networkLatencyTrend && trend) {
    els.networkLatencyTrend.setAttribute("d", trend.path);
    els.networkHealth.title = `实时延迟，每秒测量一次；最近 24 次趋势（0–${Math.ceil(trend.maximum)} ms）。${presentation.voiceText}`;
  }
  els.networkHealth.setAttribute(
    "aria-label",
    `${presentation.label}，${presentation.latencyText}，${presentation.voiceText}`,
  );

  const bars = Math.max(0, Number(presentation.overall?.bars) || 0);
  els.networkSignalBars.querySelectorAll("i").forEach((bar, index) => {
    bar.classList.toggle("is-active", index < bars);
  });
  return presentation;
}

function updateNetworkHealth() {
  const presentation = renderNetworkHealth();
  if (!presentation) {
    return;
  }

  const previousQuality = state.network.lastQualityKey;
  const nextQuality = presentation.overall?.key || "checking";
  state.network.lastQualityKey = nextQuality;
  if (!previousQuality || previousQuality === nextQuality || !["poor", "offline"].includes(nextQuality)) {
    return;
  }
  const now = Date.now();
  if (nextQuality !== "offline" && now - state.network.lastNoticeAt < 15000) return;
  state.network.lastNoticeAt = now;

  if (nextQuality === "offline") {
    addNotice("网络服务暂时无响应，正在尝试恢复连接。");
    return;
  }
  if (presentation.voice?.key === "poor") {
    addNotice("语音网络不稳，建议靠近路由器或切换更稳定的 Wi‑Fi。");
    return;
  }
  addNotice("网络质量较差，操作可能会有延迟，请检查当前网络连接。");
}

function clearNetworkProbeTimeout() {
  if (state.network.probeTimeout) {
    window.clearTimeout(state.network.probeTimeout);
    state.network.probeTimeout = null;
  }
}

function stopNetworkMonitoring() {
  if (state.network.probeTimer) {
    window.clearInterval(state.network.probeTimer);
    state.network.probeTimer = null;
  }
  if (state.network.voiceTimer) {
    window.clearInterval(state.network.voiceTimer);
    state.network.voiceTimer = null;
  }
  clearNetworkProbeTimeout();
  state.network.pendingProbe = null;
  state.network.monitorSocket = null;
  state.network.voiceCollecting = false;
}

function isActiveNetworkSocket(socket) {
  return Boolean(
    socket
    && socket === state.socket
    && socket === state.network.monitorSocket
    && state.connected
    && socket.readyState === WebSocket.OPEN,
  );
}

function recordNetworkProbeFailure(socket, probeId) {
  const network = state.network;
  if (!isActiveNetworkSocket(socket) || network.pendingProbe?.id !== probeId) {
    return;
  }
  clearNetworkProbeTimeout();
  network.pendingProbe = null;
  network.rttMs = null;
  network.rttSamples.push(null);
  network.rttSamples = network.rttSamples.slice(-24);
  network.failures = Math.min(2, network.failures + 1);
  updateNetworkHealth();

  if (network.failures < 2 && document.visibilityState !== "hidden") {
    window.setTimeout(() => runNetworkProbe(socket), 250);
  }
}

function runNetworkProbe(socket = state.socket) {
  if (!isActiveNetworkSocket(socket) || document.visibilityState === "hidden" || navigator.onLine === false) {
    return;
  }
  if (state.network.pendingProbe) {
    updateNetworkHealth();
    return;
  }

  const probeId = `n${Date.now().toString(36)}-${(++state.network.probeSequence).toString(36)}`;
  state.network.pendingProbe = { id: probeId, startedAt: networkNowMs() };
  try {
    socket.send(JSON.stringify({ type: "network_ping", probeId }));
  } catch (error) {
    console.warn("Network probe send failed", error);
    recordNetworkProbeFailure(socket, probeId);
    return;
  }

  clearNetworkProbeTimeout();
  state.network.probeTimeout = window.setTimeout(() => {
    if (document.visibilityState !== "hidden") {
      recordNetworkProbeFailure(socket, probeId);
    }
  }, NETWORK_PROBE_TIMEOUT_MS);
}

function handleNetworkPong(data) {
  const pending = state.network.pendingProbe;
  if (!pending || String(data.probeId || "") !== pending.id) {
    return;
  }

  const rttMs = Math.max(0, networkNowMs() - pending.startedAt);
  clearNetworkProbeTimeout();
  state.network.pendingProbe = null;
  state.network.rttSamples.push(rttMs);
  state.network.rttSamples = state.network.rttSamples.slice(-24);
  state.network.rttMs = rttMs;
  state.network.failures = 0;
  els.networkHealth.dataset.sampleSequence = String(state.network.probeSequence);
  updateNetworkHealth();
}

function startNetworkMonitoring(socket) {
  stopNetworkMonitoring();
  state.network.rttMs = null;
  state.network.rttSamples = [];
  state.network.failures = 0;
  state.network.lastQualityKey = null;
  state.network.monitorSocket = socket;
  state.network.voice = createVoiceNetworkState();
  updateNetworkHealth();
  runNetworkProbe(socket);
  state.network.probeTimer = window.setInterval(() => runNetworkProbe(socket), NETWORK_PROBE_INTERVAL_MS);
  state.network.voiceTimer = window.setInterval(collectVoiceNetworkStats, VOICE_NETWORK_SAMPLE_INTERVAL_MS);
  collectVoiceNetworkStats();
}

function markNetworkDisconnected() {
  stopNetworkMonitoring();
  state.network.rttMs = null;
  state.network.rttSamples = [];
  state.network.failures = 2;
  state.network.voice = createVoiceNetworkState();
  updateNetworkHealth();
}

function finiteNetworkMetric(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const metric = Number(value);
  return Number.isFinite(metric) && metric >= 0 ? metric : null;
}

function refreshVoiceNetworkAvailability() {
  const voice = state.network.voice;
  voice.active = Boolean(state.localStream);
  voice.peerCount = state.peers.size;
  if (!voice.active || voice.peerCount === 0) {
    voice.hasSamples = false;
    voice.lossPercent = null;
    voice.jitterMs = null;
    voice.previousSamples.clear();
  }
  updateNetworkHealth();
}

async function collectVoiceNetworkStats() {
  const network = state.network;
  if (network.voiceCollecting || document.visibilityState === "hidden") {
    return;
  }
  network.voiceCollecting = true;
  try {
    const voice = network.voice;
    voice.active = Boolean(state.localStream);
    const peers = [...state.peers.entries()].filter(([, peer]) => peer.pc?.connectionState !== "closed");
    voice.peerCount = peers.length;
    if (!voice.active || !peers.length) {
      voice.hasSamples = false;
      voice.lossPercent = null;
      voice.jitterMs = null;
      voice.previousSamples.clear();
      updateNetworkHealth();
      return;
    }

    voice.supported = peers.some(([, peer]) => typeof peer.pc?.getStats === "function");
    if (!voice.supported) {
      voice.hasSamples = false;
      updateNetworkHealth();
      return;
    }

    const samples = [];
    const activeKeys = new Set();
    for (const [peerId, peer] of peers) {
      if (typeof peer.pc?.getStats !== "function") {
        continue;
      }
      try {
        const reports = await peer.pc.getStats();
        for (const report of reports.values()) {
          const kind = report.kind || report.mediaType;
          const isInbound = report.type === "inbound-rtp";
          const isRemoteInbound = report.type === "remote-inbound-rtp";
          if ((isInbound || isRemoteInbound) && kind === "audio") {
            const packetsLost = finiteNetworkMetric(report.packetsLost);
            const deliveredPackets = finiteNetworkMetric(isInbound ? report.packetsReceived : report.packetsSent);
            const jitterMs = finiteNetworkMetric(report.jitter) === null ? null : Number(report.jitter) * 1000;
            const sampleKey = `${peerId}:${report.id}`;
            activeKeys.add(sampleKey);
            const previous = voice.previousSamples.get(sampleKey);
            voice.previousSamples.set(sampleKey, { packetsLost, deliveredPackets });
            const sample = networkQualityTools.deriveVoiceSample(
              { packetsLost, deliveredPackets, jitterMs },
              previous,
            );

            if (sample.lossPercent !== null || sample.jitterMs !== null) {
              samples.push(sample);
            }
          }
        }
      } catch (error) {
        console.warn("WebRTC stats unavailable for a peer", error);
      }
    }

    for (const key of [...voice.previousSamples.keys()]) {
      if (!activeKeys.has(key)) {
        voice.previousSamples.delete(key);
      }
    }

    if (!samples.length) {
      voice.hasSamples = false;
      voice.lossPercent = null;
      voice.jitterMs = null;
      updateNetworkHealth();
      return;
    }

    const score = (sample) => (sample.lossPercent ?? 0) * 100 + (sample.jitterMs ?? 0);
    const worstSample = samples.reduce((worst, sample) => (score(sample) > score(worst) ? sample : worst));
    voice.hasSamples = true;
    voice.lossPercent = worstSample.lossPercent;
    voice.jitterMs = worstSample.jitterMs;
    updateNetworkHealth();
  } finally {
    network.voiceCollecting = false;
  }
}

async function shareRoomToPhone() {
  const joinUrl = state.roomAccess?.joinUrl;
  if (!joinUrl) {
    addNotice("请先创建或加入一个房间，再发送手机链接。\n");
    return;
  }

  const shareData = {
    title: "美烂你狼人杀",
    text: `加入房间 ${state.roomCode}，和我一起玩狼人杀。`,
    url: joinUrl,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      addNotice("房间链接已打开系统分享，可发送到手机。\n");
      return;
    }
    await navigator.clipboard.writeText(joinUrl);
    addNotice("房间链接已复制，可粘贴发送到手机。\n");
  } catch (error) {
    if (error?.name !== "AbortError") {
      addNotice("暂时无法自动分享，请复制上方邀请链接到手机浏览器。\n");
    }
  }
}

async function installGameOnPhone() {
  if (state.installPrompt) {
    state.installPrompt.prompt();
    const choice = await state.installPrompt.userChoice;
    state.installPrompt = null;
    addNotice(choice.outcome === "accepted" ? "已开始安装游戏。" : "已取消安装游戏。");
    return;
  }
  addNotice("请在手机浏览器菜单中选择“添加到主屏幕”，即可像 App 一样打开游戏。\n");
}

async function shareRoomToPhoneSafe() {
  const joinUrl = state.roomAccess?.joinUrl;
  if (!joinUrl) {
    addNotice("请先创建或加入一个房间，再发送手机链接。");
    return;
  }

  const dialog = document.querySelector("#roomShareDialog");
  document.querySelector("#shareUrlInput").value = joinUrl;
  document.querySelector("#shareQrImage").src = roomQrPath();
  document.querySelector("#openShareUrlLink").href = joinUrl;
  document.querySelector("#systemShareRoomBtn").hidden = !navigator.share;
  document.querySelector("#shareCopyStatus").textContent = "扫码或复制链接后，输入昵称并点击加入房间。";
  if (!dialog.open) dialog.showModal();
}

function roomQrPath() {
  return `/game/api/rooms/${encodeURIComponent(state.roomCode)}/qr.svg`;
}

function updateMobileJoinLink() {
  const joinUrl = state.roomAccess?.joinUrl;
  els.mobileJoinLink.classList.toggle("hidden", !joinUrl);
  els.mobileJoinLink.href = joinUrl || "#";
  els.mobileJoinLink.textContent = joinUrl || "";
}

function transitionDetails(type, roundNumber) {
  if (type === "start") {
    return {
      kicker: "MEILANNI WEREWOLF",
      title: "美烂你",
      subtitle: "狼人杀 · 对局开始",
      duration: 1250,
    };
  }
  return {
    kicker: `第 ${roundNumber || 1} 夜`,
    title: "天黑请闭眼",
    subtitle: "请等待你的身份行动提示",
    duration: 1050,
  };
}

function playNextTransition() {
  if (state.transitionRunning || !state.transitionQueue.length) {
    return;
  }
  state.transitionRunning = true;
  const generation = state.transitionGeneration;
  const transition = state.transitionQueue.shift();
  const details = transitionDetails(transition.type, transition.roundNumber);
  const overlay = els.phaseTransitionOverlay;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  overlay.classList.remove("hidden", "is-visible", "is-start", "is-night");
  overlay.classList.add(transition.type === "start" ? "is-start" : "is-night");
  els.phaseTransitionKicker.textContent = details.kicker;
  els.phaseTransitionTitle.textContent = details.title;
  els.phaseTransitionSubtitle.textContent = details.subtitle;

  requestAnimationFrame(() => overlay.classList.add("is-visible"));
  window.setTimeout(() => {
    if (generation !== state.transitionGeneration) {
      return;
    }
    overlay.classList.remove("is-visible");
    window.setTimeout(() => {
      if (generation !== state.transitionGeneration) {
        return;
      }
      overlay.classList.add("hidden");
      state.transitionRunning = false;
      playNextTransition();
    }, reduceMotion ? 20 : 260);
  }, reduceMotion ? 80 : details.duration);
}

function queuePhaseTransitions(wasStarted, previousPhase, previousRound) {
  if (!state.started || state.phase === "ended") {
    return;
  }
  if (!wasStarted) {
    state.transitionQueue.push({ type: "start", roundNumber: state.roundNumber });
    if (state.phase.startsWith("night_")) {
      state.transitionQueue.push({ type: "night", roundNumber: state.roundNumber });
    }
  } else if (
    state.phase.startsWith("night_")
    && (!previousPhase?.startsWith("night_") || previousRound !== state.roundNumber)
  ) {
    state.transitionQueue.push({ type: "night", roundNumber: state.roundNumber });
  }
  playNextTransition();
}

function dismissBootSplash() {
  const splash = els.bootSplash;
  if (!splash || splash.classList.contains("is-leaving") || splash.classList.contains("hidden")) {
    return;
  }
  splash.classList.add("is-leaving");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(() => splash.classList.add("hidden"), reduceMotion ? 20 : 500);
}

function tryResumeSession() {
  if (state.sessionReplaced || !state.roomCode || !state.resumeToken) {
    return;
  }
  state.resumePending = true;
  sendMessage("resume_session", {
    roomCode: state.roomCode,
    sessionToken: state.resumeToken,
  });
}

function scheduleResumeRetry() {
  if (!state.connected || state.selfId || !state.roomCode || !state.resumeToken) {
    state.resumePending = false;
    return;
  }
  if (state.resumeAttempts >= RESUME_MAX_ATTEMPTS) {
    state.resumePending = false;
    addNotice("恢复房间失败，请重新加入房间。");
    resetRoomState(true);
    render();
    fetchDiscoverableRooms();
    return;
  }
  state.resumeAttempts += 1;
  const delay = RESUME_RETRY_BASE_MS * state.resumeAttempts;
  window.setTimeout(() => {
    if (!state.connected || state.selfId || !state.roomCode || !state.resumePending) {
      return;
    }
    addNotice(`正在重试恢复房间连接（第 ${state.resumeAttempts} 次）…`);
    tryResumeSession();
  }, delay);
}

function connectSocket() {
  if (state.sessionReplaced) return;
  const socket = new WebSocket(websocketUrl());
  state.socket = socket;

  socket.addEventListener("open", () => {
    if (state.socket !== socket) {
      socket.close();
      return;
    }
    state.connected = true;
    startNetworkMonitoring(socket);
    render();
    if (state.roomCode && state.resumeToken) {
      state.resumeAttempts = 0;
      addNotice("连接已恢复，正在尝试回到原房间。");
      tryResumeSession();
      return;
    }
    addNotice("已连接到在线房间服务。");
  });

  socket.addEventListener("close", (event) => {
    if (state.socket !== socket) {
      return;
    }
    state.connected = false;
    markNetworkDisconnected();
    cleanupAllPeers();
    if (event.code === 4001) {
      state.sessionReplaced = true;
      state.localStream?.getTracks().forEach(track => track.stop());
      state.localStream = null;
      window.clearInterval(state.meterTimer);
      state.meterTimer = null;
      state.audioContext?.close().catch(() => {});
      state.audioContext = null;
      // 不清除共享存储，新标签页仍需凭它刷新恢复席位。
      resetRoomState(false);
      state.roomCode = null;
      render();
      addNotice("此席位已在另一个页面打开，本页面已暂停连接。请使用新页面继续游戏；需要切换回来时，请刷新本页面。", { urgent: true });
      return;
    }
    render();
    addNotice("连接已断开，正在尝试恢复房间连接。");
    window.setTimeout(() => {
      if (state.socket === socket && !state.connected && !state.sessionReplaced) {
        connectSocket();
      }
    }, 1500);
  });

  socket.addEventListener("message", async (event) => {
    try {
      const data = JSON.parse(event.data);
      await handleServerMessage(data);
    } catch (error) {
      console.warn("Server message parsing failed", error);
    }
  });
}

async function fetchDiscoverableRooms() {
  try {
    const response = await fetch("/game/api/rooms", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    state.discoverableRooms = data.rooms || [];
    renderDiscoveryList();
  } catch (error) {
    console.warn("Room discovery failed", error);
  }
}

async function fetchPresetCatalog() {
  try {
    const response = await fetch("/game/api/presets", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    state.presetCatalog = Array.isArray(data.presets) ? data.presets : [];
    renderTabletopScriptPreview();
    renderPresetRules();
  } catch (error) {
    console.warn("Preset rule catalog failed to load", error);
  }
}

function getQueryJoinCode() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("join") || "").trim();
}

async function ensureVoiceEnabled() {
  if (state.sessionReplaced) return false;
  if (state.localStream) {
    return true;
  }
  if (!window.isSecureContext) {
    addNotice("当前为局域网 HTTP 页面，浏览器不允许启用麦克风。可继续文字联机和分享房间；语音需要可信 HTTPS 入口，这不是麦克风权限设置错误。");
    return false;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    addNotice("此浏览器不支持麦克风，请使用支持语音的浏览器打开游戏。");
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });
    if (state.sessionReplaced) {
      stream.getTracks().forEach(track => track.stop());
      return false;
    }
    state.localStream = stream;
    state.manualMicOpen = true;
    addNotice("麦克风授权成功，已启用自动麦控。");
    setupVoiceMeter();
    cleanupAllPeers();
    syncPeers();
    applyMicPolicy();
    collectVoiceNetworkStats();
    render();
    return true;
  } catch (error) {
    console.error(error);
    addNotice("麦克风授权失败，请检查浏览器权限。");
    return false;
  }
}

function setupVoiceMeter() {
  if (!state.localStream) {
    return;
  }
  if (!state.audioContext) {
    state.audioContext = new AudioContext();
  }
  const source = state.audioContext.createMediaStreamSource(state.localStream);
  const analyser = state.audioContext.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  state.analyser = analyser;

  if (state.meterTimer) {
    window.clearInterval(state.meterTimer);
  }

  state.meterTimer = window.setInterval(() => {
    if (!state.analyser || !state.selfId) {
      return;
    }
    const data = new Uint8Array(state.analyser.fftSize);
    state.analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (const sample of data) {
      const centered = (sample - 128) / 128;
      sum += centered * centered;
    }
    const rms = Math.sqrt(sum / data.length);
    const volume = Math.min(1, Number((rms * 4).toFixed(3)));
    sendMessage("voice_activity", {
      manualOpen: state.manualMicOpen,
      speaking: volume > 0.05,
      volume,
    });
  }, 250);
}

function cleanupPeer(peerId) {
  const peer = state.peers.get(peerId);
  if (!peer) {
    return;
  }
  peer.pc.ontrack = null;
  peer.pc.onicecandidate = null;
  peer.pc.onconnectionstatechange = null;
  peer.audio.muted = true;
  peer.audio.srcObject = null;
  peer.pc.close();
  peer.audio.remove();
  state.peers.delete(peerId);
  refreshVoiceNetworkAvailability();
}

function cleanupAllPeers() {
  for (const peerId of [...state.peers.keys()]) {
    cleanupPeer(peerId);
  }
}

function createPeer(peerId) {
  if (state.peers.has(peerId)) {
    return state.peers.get(peerId);
  }

  const pc = new RTCPeerConnection(state.rtcConfiguration);
  const audio = document.createElement("audio");
  audio.autoplay = true;
  audio.playsInline = true;
  audio.dataset.peerId = peerId;
  els.remoteAudioBucket.appendChild(audio);

  if (state.localStream) {
    for (const track of state.localStream.getTracks()) {
      pc.addTrack(track, state.localStream);
    }
  }

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      sendMessage("signal", {
        targetId: peerId,
        payload: { candidate: event.candidate, voiceEpoch: peer.epoch },
      });
    }
  };

  pc.ontrack = (event) => {
    const [stream] = event.streams;
    if (stream) {
      audio.srcObject = stream;
      applyRemoteAudioPolicies();
    }
  };

  pc.onconnectionstatechange = () => {
    if (["failed", "closed", "disconnected"].includes(pc.connectionState)) {
      cleanupPeer(peerId);
      return;
    }
    collectVoiceNetworkStats();
  };

  const peer = { pc, audio, initiated: false, epoch: state.voiceEpoch };
  state.peers.set(peerId, peer);
  refreshVoiceNetworkAvailability();
  return peer;
}

async function createOffer(peerId) {
  const peer = createPeer(peerId);
  if (peer.initiated) {
    return;
  }
  peer.initiated = true;
  const offer = await peer.pc.createOffer();
  if (state.peers.get(peerId) !== peer || peer.epoch !== state.voiceEpoch) return;
  await peer.pc.setLocalDescription(offer);
  if (state.peers.get(peerId) !== peer || peer.epoch !== state.voiceEpoch) return;
  sendMessage("signal", {
    targetId: peerId,
    payload: { description: peer.pc.localDescription, voiceEpoch: peer.epoch },
  });
}

async function handleSignal(sourceId, payload) {
  if (!state.voicePeerIds.includes(sourceId) || payload?.voiceEpoch !== state.voiceEpoch) return;
  const peer = createPeer(sourceId);
  if (payload.description) {
    const description = new RTCSessionDescription(payload.description);
    await peer.pc.setRemoteDescription(description);
    if (state.peers.get(sourceId) !== peer || peer.epoch !== state.voiceEpoch) return;
    if (description.type === "offer") {
      const answer = await peer.pc.createAnswer();
      if (state.peers.get(sourceId) !== peer || peer.epoch !== state.voiceEpoch) return;
      await peer.pc.setLocalDescription(answer);
      if (state.peers.get(sourceId) !== peer || peer.epoch !== state.voiceEpoch) return;
      sendMessage("signal", {
        targetId: sourceId,
        payload: { description: peer.pc.localDescription, voiceEpoch: peer.epoch },
      });
    }
  }

  if (payload.candidate) {
    try {
      await peer.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    } catch (error) {
      console.warn("ICE candidate error", error);
    }
  }
}

function syncPeers() {
  const wantedPeerIds = new Set(
    state.players
      .filter((player) => player.id !== state.selfId && !player.isBot && player.connected !== false && state.voicePeerIds.includes(player.id))
      .map((player) => player.id)
  );

  for (const peerId of [...state.peers.keys()]) {
    if (!wantedPeerIds.has(peerId)) {
      cleanupPeer(peerId);
    }
  }

  for (const peerId of wantedPeerIds) {
    const peer = createPeer(peerId);
    if (compareIds(state.selfId || "", peerId) < 0 && !peer.initiated) {
      createOffer(peerId).catch((error) => {
        console.error("Offer creation failed", error);
        addNotice("建立语音连接时出现问题。");
      });
    }
  }

  applyRemoteAudioPolicies();
}

function applyRemoteAudioPolicies() {
  for (const [peerId, peer] of state.peers.entries()) {
    const player = state.players.find((item) => item.id === peerId);
    const shouldMuteLocally = !state.voicePeerIds.includes(peerId) || !player?.voice?.effectiveOpen
      || Boolean(isHost() && player?.voice?.blacklistedByHost);
    peer.audio.volume = shouldMuteLocally ? 0 : 1;
    peer.audio.muted = shouldMuteLocally;
  }
}

function applyMicPolicy() {
  const track = state.localStream?.getAudioTracks()?.[0];
  if (!track) {
    return;
  }
  const me = currentPlayer();
  track.enabled = Boolean(me?.voice?.effectiveOpen);
}

function getMicPolicyLabel() {
  const me = currentPlayer();
  if (!state.localStream) {
    return "未启用";
  }
  if (!me) {
    return state.manualMicOpen ? "已授权，待入房" : "已授权，手动关闭";
  }
  if (me.voice.mutedByHost) {
    return "已被房主禁言";
  }
  if (me.voice.effectiveOpen) {
    return me.voice.manualOpen ? "手动开麦中" : "自动开麦中";
  }
  return me.voice.manualOpen ? "手动开麦待生效" : "自动关闭";
}

function renderDiscoveryList() {
  if (!state.discoverableRooms.length) {
    els.discoveryList.innerHTML = `<p class="hint">当前没有可加入的公开房间。</p>`;
    return;
  }

  els.discoveryList.innerHTML = state.discoverableRooms
    .map(
      (room) => `
        <div class="player-card">
          <div class="player-title">
            <strong>房间 ${escapeHtml(room.roomCode)}</strong>
            <div class="badges">
              <span class="badge host">${escapeHtml(room.presetLabel)}</span>
              <span class="badge spotlight">${room.players}/${room.requiredPlayers} 人</span>
              ${room.enableAiMode ? '<span class="badge bot">人机模式</span>' : ""}
            </div>
          </div>
          <p class="hint">自爆：${room.allowSelfDestruct ? "开启" : "关闭"} | 真人开局：${room.enableAiMode ? "支持" : "关闭"}</p>
          <div class="row wrap">
            <button class="small" data-fill-room="${escapeHtml(room.roomCode)}">填入房间号</button>
            <a class="button-link" href="${escapeHtml(room.joinUrl)}">直接打开</a>
          </div>
        </div>
      `
    )
    .join("");
}

function voiceBar(player) {
  const width = Math.max(8, Math.round((player.voice?.volume || 0) * 100));
  return `
    <div class="voice-row">
      <span class="voice-state ${player.voice?.effectiveOpen ? "open" : "closed"}">
        ${player.voice?.effectiveOpen ? "开麦" : "闭麦"}
      </span>
      <div class="voice-meter">
        <div class="voice-meter-fill" style="width:${width}%"></div>
      </div>
      <span class="voice-state">${player.voice?.speaking ? "说话中" : "静音"}</span>
    </div>
  `;
}

function buildPlayersListHtml() {
  if (!state.players.length) {
    return `<p class="hint">还没有房间玩家。</p>`;
  }

  return state.players
    .map((player) => {
      const badges = [];
      if (player.isHost) badges.push(`<span class="badge host">房主</span>`);
      if (player.isBot) badges.push(`<span class="badge bot">机器人</span>`);
      if (!player.isBot && player.connected === false) badges.push(`<span class="badge dead">已断线</span>`);
      if (!player.alive) badges.push(`<span class="badge dead">已出局</span>`);
      if (player.role) badges.push(`<span class="badge role">${escapeHtml(player.role)}</span>`);
      if (player.id === state.selfId) {
        badges.push(`<span class="badge spotlight">你</span>`);
      }
      if (playerPhaseSpotlight(player)) {
        badges.push(`<span class="badge spotlight">当前轮次</span>`);
      }

      const hostControls = isHost() && player.id !== state.selfId && !player.isBot
        ? `
          <div class="row wrap">
            <button class="small ${player.voice?.mutedByHost ? "success" : "danger"}" data-host-action="mute" data-id="${player.id}">
              ${player.voice?.mutedByHost ? "解除禁言" : "禁言"}
            </button>
            <button class="small" data-host-action="blacklist" data-id="${player.id}">
              ${player.voice?.blacklistedByHost ? "取消拉黑" : "拉黑语音"}
            </button>
          </div>
        `
        : "";

      return `
        <div class="player-card">
          <div class="player-title">
            <div class="player-name-row">
              ${renderPlayerNumberBadge(player)}
              <strong>${escapeHtml(displayPlayerName(player, { includeSelf: true }))}</strong>
            </div>
            <div class="badges">${badges.join("")}</div>
          </div>
          ${voiceBar(player)}
          ${player.deathReason ? `<p class="hint">原因：${escapeHtml(player.deathReason)}</p>` : ""}
          ${hostControls}
        </div>
      `;
    })
    .join("");
}

function renderPlayers() {
  els.playersList.innerHTML = buildPlayersListHtml();
}

function buildBattlePlayerCard(player) {
  const badges = [];
  if (player.id === state.selfId) badges.push(`<span class="badge spotlight">你</span>`);
  if (player.isHost) badges.push(`<span class="badge host">房主</span>`);
  if (player.isBot) badges.push(`<span class="badge bot">机器人</span>`);
  if (!player.isBot && player.connected === false) badges.push(`<span class="badge dead">已断线</span>`);
  if (!player.alive) badges.push(`<span class="badge dead">已出局</span>`);
  if (player.camp?.label) badges.push(`<span class="badge role">${escapeHtml(player.camp.label)}</span>`);
  if (player.role) badges.push(`<span class="badge spotlight">${escapeHtml(player.role)}</span>`);
  if (playerPhaseSpotlight(player)) badges.push(`<span class="badge host">当前发言</span>`);

  const hostControls = isHost() && player.id !== state.selfId && !player.isBot
    ? `
      <div class="row wrap battle-host-actions">
        <button class="small ${player.voice?.mutedByHost ? "success" : "danger"}" data-host-action="mute" data-id="${player.id}">
          ${player.voice?.mutedByHost ? "解除禁言" : "禁言"}
        </button>
        <button class="small" data-host-action="blacklist" data-id="${player.id}">
          ${player.voice?.blacklistedByHost ? "取消拉黑" : "拉黑语音"}
        </button>
      </div>
    `
    : "";

  return `
    <div class="battle-player-card ${player.alive ? "" : "battle-player-card-dead"}">
      <div class="battle-player-top">
        <div class="battle-avatar-wrap">
          <div class="battle-avatar">${avatarText(player.name)}</div>
          ${renderPlayerNumberBadge(player, "battle-player-number-badge")}
        </div>
        <div class="battle-player-meta">
          <div class="player-name-row">
            <strong>${escapeHtml(displayPlayerName(player, { includeSelf: true }))}</strong>
          </div>
          <div class="badges">${badges.join("")}</div>
        </div>
      </div>
      <div class="battle-player-stats">
        <span>${player.alive ? "存活中" : "已出局"}</span>
        <span>${player.isBot ? "机器人" : "真人"}</span>
        <span>${player.connected === false && !player.isBot ? "连接中断" : (player.voice?.effectiveOpen ? "麦克风开启" : "麦克风关闭")}</span>
      </div>
      ${player.deathReason ? `<p class="hint">出局原因：${escapeHtml(player.deathReason)}</p>` : ""}
      ${hostControls}
    </div>
  `;
}

function renderBattlePlayers() {
  const { left, right } = splitBattleSides(state.players);
  els.battleLeftCount.textContent = `${left.length} 人`;
  els.battleRightCount.textContent = `${right.length} 人`;
  els.battleLeftPlayers.innerHTML = left.length
    ? left.map(buildBattlePlayerCard).join("")
    : `<p class="hint">左侧阵营区域暂时没有已分配玩家。</p>`;
  els.battleRightPlayers.innerHTML = right.length
    ? right.map(buildBattlePlayerCard).join("")
    : `<p class="hint">右侧阵营区域暂时没有已分配玩家。</p>`;
  const tablePlayers = sortPlayersForBattle(state.players);
  const tablePlayerCount = tablePlayers.length;
  els.battleTablePlayers.innerHTML = tablePlayerCount
    ? tablePlayers.map((player, index) => {
        const angle = (Math.PI * 2 * index / tablePlayerCount) - (Math.PI / 2);
        const seatX = 50 + (36 * Math.cos(angle));
        const seatY = 50 + (39 * Math.sin(angle));
        return `
        <div class="battle-table-seat ${tablePlayerCount > 8 ? "is-compact" : ""} ${player.id === state.selfId ? "is-self" : ""} ${player.alive ? "" : "is-dead"}" style="left: ${seatX.toFixed(3)}%; top: ${seatY.toFixed(3)}%;">
          <span class="battle-table-seat-number">${escapeHtml(playerSequenceNumber(player) || index + 1)}</span>
          <span class="battle-table-seat-avatar">${avatarText(player.name)}</span>
          <strong>${escapeHtml(displayPlayerName(player, { includeSelf: true }))}</strong>
          <small>${player.alive ? (playerPhaseSpotlight(player) ? "正在发言" : "存活") : "已出局"}</small>
        </div>
      `;
      }).join("")
    : `<p class="battle-table-empty">等待玩家入座</p>`;
  els.battleTablePhase.textContent = state.phaseLabel || "等待开局";
  els.battleTableCount.textContent = `${state.players.filter((player) => player.alive).length} / ${state.players.length}`;
  els.battleTablePrompt.textContent = state.started
    ? (state.phaseLabel || "请留意当前行动")
    : "等待房主开始游戏";
}

function buildSelectOptions(candidates, options = {}) {
  const {
    includeSkip = false,
    includePrompt = false,
    promptLabel = "请选择目标",
    skipLabel = "不使用 / 跳过",
    selectedValue = undefined,
  } = options;
  const items = [
    ...(includePrompt ? [{ id: "__prompt__", name: promptLabel }] : []),
    ...(includeSkip ? [{ id: "", name: skipLabel }] : []),
    ...candidates,
  ];
  return items
    .map(
      (candidate, index) => {
        const isSelected = selectedValue !== undefined
          ? String(candidate.id) === String(selectedValue)
          : index === 0 && includePrompt;
        return `<option value="${escapeHtml(candidate.id)}" ${isSelected ? "selected" : ""}>${escapeHtml(displayCandidateName(candidate))}</option>`;
      }
    )
    .join("");
}

function actionDraftKey(hint) {
  // 带上轮次：上一夜的守卫目标 / 上一轮公投对象不会在新回合被预选。
  return `${state.roundNumber}:${hint.type}:${hint.title || ""}`;
}

function getActionDraftValue(hint) {
  const key = actionDraftKey(hint);
  if (Object.prototype.hasOwnProperty.call(state.actionDrafts, key)) {
    return state.actionDrafts[key];
  }
  if (hint.type === "vote" && hint.hasSubmitted) {
    return hint.submittedTargetId ?? "";
  }
  return "__prompt__";
}

function actionPanelSignature() {
  return JSON.stringify((state.selfView?.actionHints || []).map((hint) => ({
    type: hint.type,
    title: hint.title,
    candidates: (hint.candidates || []).map((candidate) => `${candidate.id}:${candidate.alive}`),
    hasSubmitted: hint.hasSubmitted,
    submittedTargetId: hint.submittedTargetId ?? null,
    attackedPlayerId: hint.attackedPlayerId ?? null,
    canSave: hint.canSave ?? null,
    canPoison: hint.canPoison ?? null,
    lastResult: hint.lastResult ?? null,
    wolfChat: hint.wolfChat ?? [],
  })));
}

function syncActionDraftsFromHints() {
  const nextDrafts = {};
  for (const hint of state.selfView?.actionHints || []) {
    const key = actionDraftKey(hint);
    const current = state.actionDrafts[key];
    const candidateIds = new Set((hint.candidates || []).map((candidate) => String(candidate.id)));
    if (hint.type === "vote" && hint.hasSubmitted) {
      nextDrafts[key] = hint.submittedTargetId ?? "";
      continue;
    }
    if (current === "__prompt__" || current === "" || candidateIds.has(String(current))) {
      nextDrafts[key] = current ?? "__prompt__";
      continue;
    }
    nextDrafts[key] = "__prompt__";
  }
  state.actionDrafts = nextDrafts;
}

function buildActionPanelHtml() {
  const hints = state.selfView?.actionHints || [];
  if (!hints.length) {
    return `<p class="hint">当前没有可执行的专属操作，系统会按阶段自动控制麦克风。</p>`;
  }

  return hints
    .map((hint, index) => {
      if (hint.type === "wolf_chat") {
        const messages = (hint.wolfChat || []).map((item) => `<p><strong>${escapeHtml(item.playerId === state.selfId ? "你" : "狼人队友")}：</strong>${escapeHtml(item.content)}</p>`).join("") || "<p>等待队友发言…</p>";
        const countdown = formatWolfDiscussionCountdown();
        return `
          <div class="action-card wolf-chat-card" data-index="${index}">
            <strong>${escapeHtml(hint.title)} · <span data-wolf-countdown>${escapeHtml(countdown || "30 秒后自动选刀")}</span></strong>
            <div class="wolf-chat-log">${messages}</div>
            <textarea data-wolf-chat maxlength="240" placeholder="仅狼人可见：提出刀口、分析或回应队友">${escapeHtml(state.wolfChatDraft)}</textarea>
            <button class="primary" data-wolf-chat-send>发送密谈</button>
          </div>
        `;
      }
      if (["guard", "wolf_vote", "seer", "vote", "hunter_shot", "white_wolf_king_blast", "knight_duel"].includes(hint.type)) {
        const voteLocked = hint.type === "vote" && hint.hasSubmitted;
        const includeSkip = hint.type === "hunter_shot" || hint.type === "vote";
        const skipLabel = hint.type === "vote" ? "弃票" : "不使用 / 跳过";
        const requireManualPick = ["guard", "wolf_vote", "seer", "vote", "white_wolf_king_blast", "knight_duel", "hunter_shot"].includes(hint.type);
        const selectedValue = getActionDraftValue(hint);
        return `
          <div class="action-card" data-index="${index}">
            <strong>${escapeHtml(hint.title)}</strong>
            ${hint.type === "seer" ? `<p class="hint">请手动选择你要查验的存活玩家。</p>${hint.lastResult ? `<p class="hint">上次查验：${escapeHtml(hint.lastResult)}</p>` : ""}` : ""}
            ${voteLocked ? `<p class="hint">你已投给：${escapeHtml(hint.submittedTargetDisplayName || hint.submittedTargetName || "弃票")}，当前选择已锁定。</p>` : ""}
            <select data-field="targetId" ${voteLocked ? "disabled" : ""}>
              ${buildSelectOptions(hint.candidates || [], {
                includeSkip,
                skipLabel,
                includePrompt: requireManualPick,
                promptLabel: hint.type === "seer" ? "请选择要查验的玩家" : (hint.type === "vote" ? "请选择要投票的玩家" : "请选择目标"),
                selectedValue,
              })}
            </select>
            <button class="primary" data-game-action="${hint.type}" ${voteLocked ? "disabled" : ""}>${voteLocked ? "已锁定" : "提交"}</button>
          </div>
        `;
      }

      if (hint.type === "witch") {
        return `
          <div class="action-card" data-index="${index}">
            <strong>${escapeHtml(hint.title)}</strong>
            <p class="hint">今晚中刀：${escapeHtml(hint.attackedPlayerDisplayName || hint.attackedPlayerName || "平安夜")}</p>
            <label class="checkbox-row">
              <input data-field="save" type="checkbox" ${hint.canSave ? "" : "disabled"} />
              <span>使用解药</span>
            </label>
            <select data-field="targetId" ${hint.canPoison ? "" : "disabled"}>
              ${buildSelectOptions(hint.candidates || [], { includeSkip: true, skipLabel: "不使用毒药" })}
            </select>
            <p class="hint">每晚只能使用一瓶药：解药与毒药不能同时使用。</p>
            <button class="primary" data-game-action="witch">提交女巫操作</button>
          </div>
        `;
      }

      if (hint.type === "end_speech" || hint.type === "end_last_words" || hint.type === "self_destruct") {
        return `
          <div class="action-card" data-index="${index}">
            <strong>${escapeHtml(hint.title)}</strong>
            <button class="primary" data-game-action="${hint.type}">确认</button>
          </div>
        `;
      }

      return `
        <div class="action-card" data-index="${index}">
          <strong>${escapeHtml(hint.title || hint.type)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderActionPanel() {
  syncActionDraftsFromHints();
  const signature = actionPanelSignature();
  if (signature === state.actionPanelSignature) {
    return;
  }
  state.actionPanelSignature = signature;
  const focused = document.activeElement?.matches("[data-wolf-chat]") ? document.activeElement : null;
  const focusPanel = focused?.closest("#battleActionPanel, #actionPanel");
  const selection = focused ? [focused.selectionStart, focused.selectionEnd] : null;
  const html = buildActionPanelHtml();
  els.actionPanel.innerHTML = html;
  els.battleActionPanel.innerHTML = html;
  const nextInput = focusPanel?.querySelector("[data-wolf-chat]");
  if (nextInput && selection) {
    nextInput.focus({ preventScroll: true });
    nextInput.setSelectionRange(...selection);
  }
}

function actionNeedsManualTarget(action) {
  return ["guard", "wolf_vote", "seer", "white_wolf_king_blast", "knight_duel"].includes(action);
}

function renderNotices() {
  const now = Date.now();
  state.ephemeralNotices = state.ephemeralNotices.filter((item) => now - item.at < EPHEMERAL_NOTICE_TTL_MS);
  const summary = document.querySelector("#castleLastNotice");
  if (summary) {
    summary.textContent = state.ephemeralNotices[0]?.text || "在线联机 · 扫码或房间号加入";
    summary.title = summary.textContent;
  }
  const merged = [
    ...state.ephemeralNotices.map((item) => item.text),
    ...state.notices,
  ].slice(0, 30);
  if (!merged.length) {
    const emptyHtml = `<p class="hint">等待系统消息。</p>`;
    els.noticeLog.innerHTML = emptyHtml;
    els.battleNoticeLog.innerHTML = emptyHtml;
    return;
  }
  const html = merged
    .map((notice) => `<div class="notice-item">${escapeHtml(notice)}</div>`)
    .join("");
  els.noticeLog.innerHTML = html;
  els.battleNoticeLog.innerHTML = html;
}

function renderVotePanel() {
  const snapshot = currentVoteSnapshot();
  if (!snapshot) {
    els.votePanelSummary.textContent = "当前还未进入公投阶段。";
    els.votePanelRanking.innerHTML = "";
    els.votePanelRecords.innerHTML = `<p class="hint">进入白天公投后，这里会实时显示所有公开投票内容。</p>`;
    return;
  }

  const summaryText = state.phase === "day_vote"
    ? `公投进行中：已提交 ${snapshot.submittedCount}/${snapshot.eligibleVoterCount} 票，剩余 ${formatVoteCountdown()}。超过 20 秒未投票自动记为弃票。`
    : `第 ${snapshot.roundNumber || state.roundNumber} 轮公投已结束：${snapshot.voteResultText || "等待结算"}`
  els.votePanelSummary.textContent = summaryText;

  const ranking = snapshot.voteRanking || [];
  els.votePanelRanking.innerHTML = ranking.length
    ? ranking.map((item, index) => `
        <div class="vote-ranking-item">
          <span>#${index + 1}</span>
          <strong>${escapeHtml(item.targetDisplayName || item.targetName)}</strong>
          <span>${item.votes} 票</span>
        </div>
      `).join("")
    : `<p class="hint">当前没有有效票，弃票 ${snapshot.abstainCount || 0} 人。</p>`;

  const records = snapshot.publicVotes || [];
  els.votePanelRecords.innerHTML = records.length
    ? records.map((record) => `
        <div class="vote-record-item">
          <div class="vote-record-main">
            <strong>${escapeHtml(record.actorDisplayName || record.actorName)}</strong>
            <span>投给</span>
            <strong>${escapeHtml(record.targetDisplayName || record.targetName || "弃票")}</strong>
          </div>
          <div class="vote-record-meta">
            <span>${escapeHtml(formatVoteTimestamp(record.submittedAt))}</span>
            <span>${record.locked ? "已锁定" : "未锁定"}</span>
          </div>
        </div>
      `).join("")
    : `<p class="hint">当前还没有玩家提交投票。</p>`;
}

function renderRoomAccess() {
  if (!state.roomAccess) {
    els.roomQrImage.removeAttribute("src");
    els.tabletopQrTicket?.classList.remove("is-ready");
    els.joinUrlValue.textContent = "创建房间后显示";
    const dialog = document.querySelector('#roomShareDialog');
    if (dialog.open) dialog.close();
    return;
  }
  const qrPath = roomQrPath();
  if (els.roomQrImage.getAttribute('src') !== qrPath) {
    els.tabletopQrTicket?.classList.remove('is-ready');
    els.roomQrImage.onload = () => els.tabletopQrTicket?.classList.add('is-ready');
    els.roomQrImage.onerror = () => {
      els.tabletopQrTicket?.classList.remove('is-ready');
      els.tabletopQrTicket.querySelector('.tabletop-qr-placeholder').textContent = '二维码加载失败，请使用邀请链接';
    };
    els.roomQrImage.src = qrPath;
  }
  els.joinUrlValue.textContent = state.roomAccess.joinUrl;
}

function render() {
  const battle = isBattleView();
  document.body.classList.toggle("battle-mode", battle);
  els.lobbyView.classList.toggle("hidden", battle);
  els.battleView.classList.toggle("hidden", !battle);

  els.connectionStatus.textContent = state.connected ? "已连接" : "未连接";
  els.roomCodeValue.textContent = state.roomCode || "未加入";
  els.phaseValue.textContent = state.phaseLabel;
  els.roundValue.textContent = String(state.roundNumber || 0);
  els.roleValue.textContent = state.selfView?.roleLabel || "未分配";
  els.micPolicyValue.textContent = getMicPolicyLabel();
  els.speechTimerValue.textContent = formatPrimaryTimer();
  els.winnerValue.textContent = state.winnerLabel || "进行中";
  els.battleRoomCodeValue.textContent = state.roomCode || "未加入";
  els.battlePhaseValue.textContent = state.phaseLabel;
  els.battleRoundValue.textContent = String(state.roundNumber || 0);
  els.battleRoleValue.textContent = state.selfView?.roleLabel || "未分配";
  els.battleSpeechTimerValue.textContent = formatPrimaryTimer();
  els.battleStageSummary.textContent = state.started
    ? `${state.phaseLabel} | ${state.winnerLabel || "胜负未定"} | 当前共 ${state.players.length} 名玩家参与对局`
    : "等待房主开始游戏。";
  els.battleLeftHint.textContent = "左侧优先显示已识别的狼人阵营，未知信息会自动补齐空位。";
  els.battleRightHint.textContent = "右侧优先显示已识别的好人阵营，其余玩家会保持安全排布。";

  const host = isHost();
  els.hostControls.classList.toggle("hidden", !host);
  els.hostHint.classList.toggle("hidden", host);
  els.battleHostControls.classList.toggle("hidden", !host || !state.started);
  els.manualMicBtn.textContent = state.manualMicOpen ? "手动关麦" : "手动开麦";
  els.leaveRoomBtn.classList.toggle("hidden", !state.roomCode);
  els.shareRoomBtn.disabled = !state.roomAccess?.joinUrl;
  els.mobilePlayHint.textContent = state.roomAccess?.joinUrl
    ? "将邀请链接发给朋友；使用手机流量或不同 Wi-Fi 都能入房一起玩。"
    : "创建房间后，将邀请链接发送给朋友即可加入。";

  const playersCount = state.players.length;
  const humanPlayersCount = state.players.filter((player) => !player.isBot).length;
  const requiredPlayers = state.config?.requiredPlayers || 12;
  const playerCountFitsBoard = playersCount <= requiredPlayers;
  const aiCanStart = playerCountFitsBoard && Boolean(state.config?.enableAiMode) && humanPlayersCount >= 1;
  const canStart = playerCountFitsBoard && (aiCanStart || playersCount === requiredPlayers);
  els.startGameBtn.disabled = !host || state.started || !canStart;
  els.configSummary.textContent = state.config
    ? `${state.config.presetLabel} | ${playersCount}/${requiredPlayers} 人 | 真人 ${humanPlayersCount} | 自爆${state.config.allowSelfDestruct ? "开启" : "关闭"} | 人机模式${state.config.enableAiMode ? "开启" : "关闭"}`
    : "尚未建房";

  if (state.config) {
    // 只在服务端配置真正变化时回填表单，避免高频 room_state 把房主正在编辑的板子回滚。
    if (state.config.preset !== state.syncedConfigPreset) {
      els.hostPresetSelect.value = state.config.preset;
      state.syncedConfigPreset = state.config.preset;
    }
    if (state.config.allowSelfDestruct !== state.syncedAllowSelfDestruct) {
      els.hostSelfDestructInput.checked = state.config.allowSelfDestruct;
      state.syncedAllowSelfDestruct = state.config.allowSelfDestruct;
    }
    if (Boolean(state.config.enableAiMode) !== state.syncedEnableAiMode) {
      els.hostAiModeInput.checked = Boolean(state.config.enableAiMode);
      state.syncedEnableAiMode = Boolean(state.config.enableAiMode);
    }
  }
  els.aiModeInput.checked = Boolean(state.config?.enableAiMode ?? els.aiModeInput.checked);

  renderPlayers();
  renderBattlePlayers();
  renderActionPanel();
  renderNotices();
  renderVotePanel();
  updateMobileJoinLink();
  renderRoomAccess();
  applyRemoteAudioPolicies();
  renderTabletopScriptPreview();
  renderPresetRules();
}

async function handleServerMessage(data) {
  if (data.type === "network_pong") {
    handleNetworkPong(data);
    return;
  }

  if (data.type === "room_state") {
    if (state.sessionReplaced) return;
    if (!state.selfId) document.querySelector("#gameFeedback").classList.add("hidden");
    const wasStarted = state.started;
    const previousPhase = state.phase;
    const previousRound = state.roundNumber;
    state.roomCode = data.roomCode;
    state.selfId = data.selfId;
    state.hostId = data.hostId;
    state.started = data.started;
    state.phase = data.phase;
    state.phaseLabel = data.phaseLabel;
    state.roundNumber = data.roundNumber;
    if (previousRound !== data.roundNumber || previousPhase !== data.phase) state.wolfChatDraft = "";
    if (state.voiceEpoch !== data.voiceEpoch) {
      const track = state.localStream?.getAudioTracks()?.[0];
      if (track) track.enabled = false;
      cleanupAllPeers();
    }
    state.voiceEpoch = data.voiceEpoch ?? null;
    state.voicePeerIds = data.voicePeerIds || [];
    state.rtcConfiguration = data.rtcConfiguration || { iceServers: [], iceTransportPolicy: "all" };
    state.winnerLabel = data.winnerLabel;
    state.config = data.config;
    state.speechTimer = data.speechTimer || null;
    state.voteTimer = data.voteTimer || null;
    state.skillTimer = data.skillTimer || null;
    state.wolfDiscussionTimer = data.wolfDiscussionTimer || null;
    state.resumePending = false;
    state.resumeAttempts = 0;
    state.day = data.day || {};
    state.voteSummary = data.voteSummary || null;
    state.roomAccess = data.roomAccess;
    state.players = [...(data.players || [])].sort(comparePlayerSequence);
    state.selfView = data.selfView || { roleLabel: "未分配", actionHints: [] };
    state.notices = data.notices || [];
    state.resumeToken = data.sessionToken || state.resumeToken;
    window.localStorage.setItem(RESUME_TOKEN_STORAGE_KEY, state.resumeToken);
    if (state.roomCode) {
      window.localStorage.setItem(LAST_ROOM_STORAGE_KEY, state.roomCode);
    }

    const me = currentPlayer();
    if (me) {
      state.manualMicOpen = Boolean(me.voice?.manualOpen);
      if (state.awaitingJoinMicOpen && !me.voice?.manualOpen) {
        sendMessage("set_manual_mic", { open: true });
      } else {
        state.awaitingJoinMicOpen = false;
      }
    }

    syncPeers();
    applyMicPolicy();
    render();
    queuePhaseTransitions(wasStarted, previousPhase, previousRound);
    return;
  }

  if (data.type === "notice" || data.type === "action_result") {
    addNotice(data.message);
    return;
  }

  if (data.type === "left_room") {
    resetRoomState(true);
    render();
    addNotice(data.message || "你已退出当前房间。");
    fetchDiscoverableRooms();
    return;
  }

  if (data.type === "resume_failed") {
    state.resumePending = false;
    resetRoomState(true);
    render();
    addNotice(data.message || "恢复房间失败，请重新加入。");
    fetchDiscoverableRooms();
    return;
  }

  if (data.type === "error") {
    // 重连后还没回到房间时，error 很可能来自恢复请求被拒（旧连接尚未被服务端清理），
    // 按退避重试，避免玩家被永久踢出对局。
    if (state.connected && state.resumePending && state.roomCode && !state.selfId) {
      addNotice(`错误：${data.message}`);
      scheduleResumeRetry();
      return;
    }
    addNotice(`错误：${data.message}`);
    return;
  }

  if (data.type === "signal") {
    await handleSignal(data.sourceId, data.payload);
  }
}

async function createRoom() {
  if (state.sessionReplaced) {
    addNotice("本页面已暂停连接，请使用新页面继续游戏，或刷新本页面接管席位。", { urgent: true });
    return;
  }
  state.awaitingJoinMicOpen = true;
  await ensureVoiceEnabled();
  if (state.sessionReplaced) return;
  sendMessage("create_room", {
    name: els.nameInput.value.trim() || "房主",
    preset: els.presetSelect.value,
    allowSelfDestruct: els.selfDestructInput.checked,
    enableAiMode: els.aiModeInput.checked,
    sessionToken: state.resumeToken,
  });
}

async function joinRoom() {
  if (state.sessionReplaced) {
    addNotice("本页面已暂停连接，请使用新页面继续游戏，或刷新本页面接管席位。", { urgent: true });
    return;
  }
  state.awaitingJoinMicOpen = true;
  await ensureVoiceEnabled();
  if (state.sessionReplaced) return;
  sendMessage("join_room", {
    name: els.nameInput.value.trim() || "玩家",
    roomCode: els.roomCodeInput.value.trim(),
    sessionToken: state.resumeToken,
  });
}

function toggleManualMic() {
  state.manualMicOpen = !state.manualMicOpen;
  if (!state.localStream) {
    ensureVoiceEnabled().then((ok) => {
      if (!ok) {
        return;
      }
      if (state.selfId) {
        sendMessage("set_manual_mic", { open: state.manualMicOpen });
      }
      render();
    });
    return;
  }
  if (state.selfId) {
    sendMessage("set_manual_mic", { open: state.manualMicOpen });
  }
  applyMicPolicy();
  render();
}

function leaveCurrentRoom() {
  if (!state.roomCode) {
    addNotice("你当前不在房间内。");
    return;
  }
  sendMessage("leave_room");
}

function bindEvents() {
  document.querySelector("#dismissGameFeedback").addEventListener("click", () => {
    document.querySelector("#gameFeedback").classList.add("hidden");
  });
  document.querySelectorAll("[data-castle-preset], [data-castle-count]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.selfId) return;
      const byCount = {9: "nine_hunter", 10: "ten_guard", 11: "eleven_guard", 12: "standard"};
      const preset = button.dataset.castlePreset || byCount[button.dataset.castleCount];
      if (!preset) return;
      els.presetSelect.value = preset;
      els.presetSelect.dispatchEvent(new Event("change", {bubbles: true}));
    });
  });
  els.roomCodeInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !els.joinRoomBtn.disabled) els.joinRoomBtn.click();
  });
  document.querySelector("#closeShareDialogBtn").addEventListener("click", () => document.querySelector("#roomShareDialog").close());
  document.querySelector('#showRoomInviteBtn').addEventListener('click', shareRoomToPhoneSafe);
  document.querySelector('#systemShareRoomBtn').addEventListener('click', async () => {
    if (!state.roomAccess?.joinUrl || !navigator.share) return;
    try {
      await navigator.share({title:'美烂你狼人杀',text:`加入房间 ${state.roomCode}`,url:state.roomAccess.joinUrl});
    } catch (error) {
      if (error.name !== 'AbortError') document.querySelector('#shareCopyStatus').textContent = '系统分享不可用，请复制下方链接。';
    }
  });
  document.querySelector("#copyShareUrlBtn").addEventListener("click", async () => {
    const input = document.querySelector("#shareUrlInput");
    const status = document.querySelector("#shareCopyStatus");
    input.focus();
    input.select();
    input.setSelectionRange(0, input.value.length);
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(input.value); copied = true; }
      else copied = document.execCommand("copy");
    } catch (_) {
      try { copied = document.execCommand('copy'); } catch (_) { /* Keep manual selection available. */ }
    }
    status.textContent = copied ? "链接已复制，可发送给任何网络下的好友。" : "链接已选中，请长按选择“复制”，或让好友扫描二维码。";
  });
  els.createRoomBtn.addEventListener("click", createRoom);
  els.joinRoomBtn.addEventListener("click", joinRoom);
  els.enableVoiceBtn.addEventListener("click", ensureVoiceEnabled);
  els.manualMicBtn.addEventListener("click", toggleManualMic);
  els.leaveRoomBtn.addEventListener("click", leaveCurrentRoom);
  els.battleLeaveRoomBtn.addEventListener("click", leaveCurrentRoom);
  els.shareRoomBtn.addEventListener("click", shareRoomToPhoneSafe);
  els.installGameBtn.addEventListener("click", installGameOnPhone);
  els.skipBootBtn.addEventListener("click", dismissBootSplash);

  [els.presetRulesBtn, els.hostPresetRulesBtn, els.battlePresetRulesBtn, els.altarRulesBtn]
    .filter(Boolean)
    .forEach((button) => button.addEventListener("click", () => openPresetRules(button)));
  els.presetRulesClose?.addEventListener("click", closePresetRules);
  els.presetRulesOverlay?.addEventListener("click", (event) => {
    if (event.target === els.presetRulesOverlay) {
      closePresetRules();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isRulesOverlayOpen()) {
      closePresetRules();
    }
  });
  [
    els.presetSelect,
    els.selfDestructInput,
    els.hostPresetSelect,
    els.hostSelfDestructInput,
  ].filter(Boolean).forEach((field) => field.addEventListener("change", () => {
    renderTabletopScriptPreview();
    if (isRulesOverlayOpen()) {
      renderPresetRules();
    }
  }));

  els.startGameBtn.addEventListener("click", () => {
    sendMessage("start_game");
  });

  els.forceNextSpeechBtn.addEventListener("click", () => {
    sendMessage("force_next_speech");
  });

  els.battleForceNextSpeechBtn.addEventListener("click", () => {
    sendMessage("force_next_speech");
  });

  els.syncStateBtn.addEventListener("click", () => {
    sendMessage("sync_state");
  });

  els.battleSyncStateBtn.addEventListener("click", () => {
    sendMessage("sync_state");
  });

  els.saveConfigBtn.addEventListener("click", () => {
    const selectedRulebook = rulebookForPreset(els.hostPresetSelect.value);
    const requiredPlayers = Number(selectedRulebook?.playerCount);
    if (Number.isFinite(requiredPlayers) && state.players.length > requiredPlayers) {
      addNotice(`当前已有 ${state.players.length} 人，不能切换到 ${requiredPlayers} 人板子。`);
      els.hostPresetSelect.value = state.config?.preset || els.hostPresetSelect.value;
      renderPresetRules();
      return;
    }
    sendMessage("update_config", {
      preset: els.hostPresetSelect.value,
      allowSelfDestruct: els.hostSelfDestructInput.checked,
      enableAiMode: els.hostAiModeInput.checked,
    });
  });

  els.discoveryList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-fill-room]");
    if (!button) {
      return;
    }
    els.roomCodeInput.value = button.dataset.fillRoom || "";
  });

  const handleHostPlayerAction = (event) => {
    const button = event.target.closest("button[data-host-action]");
    if (!button) {
      return;
    }
    const player = state.players.find((item) => item.id === button.dataset.id);
    if (!player) {
      return;
    }
    if (button.dataset.hostAction === "mute") {
      sendMessage("host_voice_control", {
        targetId: player.id,
        muted: !player.voice?.mutedByHost,
      });
    }
    if (button.dataset.hostAction === "blacklist") {
      sendMessage("host_voice_control", {
        targetId: player.id,
        blacklisted: !player.voice?.blacklistedByHost,
      });
    }
  };

  els.playersList.addEventListener("click", handleHostPlayerAction);
  els.battleLeftPlayers.addEventListener("click", handleHostPlayerAction);
  els.battleRightPlayers.addEventListener("click", handleHostPlayerAction);

  const handleActionPanelClick = (event) => {
    const chatButton = event.target.closest("button[data-wolf-chat-send]");
    if (chatButton) {
      const card = chatButton.closest(".action-card");
      const input = card?.querySelector("[data-wolf-chat]");
      const content = input?.value.trim();
      if (!content) {
        addNotice("请输入狼人密谈内容。");
        return;
      }
      sendMessage("wolf_chat", { content });
      input.value = "";
      state.wolfChatDraft = "";
      return;
    }
    const button = event.target.closest("button[data-game-action]");
    if (!button) {
      return;
    }
    const action = button.dataset.gameAction;
    const card = button.closest(".action-card");
    const targetField = card?.querySelector("[data-field='targetId']");
    const saveField = card?.querySelector("[data-field='save']");
    const targetValue = targetField ? targetField.value : null;

    if (action === "witch" && saveField?.checked && targetValue) {
      addNotice("每晚只能使用一瓶药：请取消解药或清空毒药目标。");
      return;
    }
    if (action === "witch" && targetValue === "__prompt__") {
      addNotice("请选择毒药目标，或选择“不使用毒药”。");
      return;
    }

    // 允许显式空选择（弃票/猎人跳过），但拦截未做选择的占位项。
    if (targetValue === "__prompt__") {
      if (action === "vote") {
        addNotice("请选择要投票的玩家，或选择“弃票”。");
        return;
      }
      if (action === "hunter_shot") {
        addNotice("请选择开枪目标，或选择“不使用 / 跳过”。");
        return;
      }
      if (action === "seer") {
        addNotice("请先选择你要查验的玩家。");
        return;
      }
      addNotice("请先选择目标。");
      return;
    }
    if (actionNeedsManualTarget(action) && !targetValue) {
      addNotice("请先选择目标。");
      return;
    }

    sendMessage("game_action", {
      action,
      targetId: targetField ? (targetValue === "__prompt__" ? null : targetValue || null) : null,
      save: saveField ? saveField.checked : false,
    });
  };

  const handleActionPanelChange = (event) => {
    const field = event.target.closest("[data-field='targetId']");
    if (!field) {
      return;
    }
    const card = field.closest(".action-card");
    const index = Number(card?.dataset.index ?? -1);
    const hint = state.selfView?.actionHints?.[index];
    if (!hint) {
      return;
    }
    state.actionDrafts[actionDraftKey(hint)] = field.value;
  };

  els.actionPanel.addEventListener("click", handleActionPanelClick);
  els.battleActionPanel.addEventListener("click", handleActionPanelClick);
  els.actionPanel.addEventListener("change", handleActionPanelChange);
  els.battleActionPanel.addEventListener("change", handleActionPanelChange);
  const keepWolfDraft = event => {
    if (event.target.matches("[data-wolf-chat]")) state.wolfChatDraft = event.target.value;
  };
  els.actionPanel.addEventListener("input", keepWolfDraft);
  els.battleActionPanel.addEventListener("input", keepWolfDraft);
}

mountCastleLobby();
bindEvents();

// 8.5 seconds of animation + 0.5 seconds fading out = 9 seconds total.
window.setTimeout(dismissBootSplash, window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 120 : 8500);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.installPrompt = event;
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stopNetworkMonitoring();
    return;
  }
  if (state.connected && state.socket?.readyState === WebSocket.OPEN) {
    startNetworkMonitoring(state.socket);
  }
});

window.addEventListener("offline", () => {
  clearNetworkProbeTimeout();
  state.network.pendingProbe = null;
  state.network.rttMs = null;
  state.network.failures = 2;
  updateNetworkHealth();
});
window.addEventListener("online", () => {
  if (state.connected && state.socket?.readyState === WebSocket.OPEN) {
    startNetworkMonitoring(state.socket);
  } else if (!state.socket || state.socket.readyState === WebSocket.CLOSED) {
    connectSocket();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/game/service-worker.js").catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  });
}

const joinCode = getQueryJoinCode();
if (joinCode) {
  els.roomCodeInput.value = joinCode;
  if (/^\d{6}$/.test(joinCode)) {
    const invitation = document.querySelector('#incomingRoomInvite');
    invitation.textContent = `受邀加入房间 ${joinCode}：输入昵称，然后点击下方“加入房间”。`;
    invitation.classList.remove('hidden');
  }
}

connectSocket();
fetchDiscoverableRooms();
fetchPresetCatalog();
window.setInterval(fetchDiscoverableRooms, 10000);
window.setInterval(() => {
  if (!state.started) {
    return;
  }
  els.speechTimerValue.textContent = formatPrimaryTimer();
  els.battleSpeechTimerValue.textContent = formatPrimaryTimer();
  if (state.phase === "day_vote") {
    els.votePanelSummary.textContent = `公投进行中：已提交 ${(state.day?.publicVotes || []).length}/${state.voteTimer?.eligibleVoterCount || state.day?.eligibleVoterCount || 0} 票，剩余 ${formatVoteCountdown()}。超过 20 秒未投票自动记为弃票。`;
  }
  const wolfCountdownText = formatWolfDiscussionCountdown() || "30 秒后自动选刀";
  document.querySelectorAll("[data-wolf-countdown]").forEach((node) => {
    node.textContent = wolfCountdownText;
  });
}, 1000);
render();
