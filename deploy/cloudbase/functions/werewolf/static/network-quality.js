(function attachNetworkQualityTools(global) {
  "use strict";

  const QUALITY_RANK = {
    offline: 0,
    checking: 0,
    poor: 1,
    good: 2,
    excellent: 3,
  };

  function finiteNumber(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function roundMetric(value, digits = 0) {
    const number = finiteNumber(value);
    if (number === null) {
      return null;
    }
    const factor = 10 ** digits;
    return Math.round(number * factor) / factor;
  }

  function classifyServerQuality({ connected, rttMs, failures = 0 } = {}) {
    if (!connected || failures >= 2) {
      return { key: "offline", label: "已断开", bars: 0 };
    }

    if (failures > 0) {
      return { key: "poor", label: "较差", bars: 1 };
    }

    const rtt = finiteNumber(rttMs);
    if (rtt === null) {
      return { key: "checking", label: "检测中", bars: 0 };
    }
    if (rtt > 120) {
      return { key: "poor", label: "较差", bars: 1 };
    }
    if (rtt > 50) {
      return { key: "good", label: "良好", bars: 3 };
    }
    return { key: "excellent", label: "优秀", bars: 4 };
  }

  function classifyVoiceQuality({ active, peerCount = 0, supported = true, hasSamples, lossPercent, jitterMs } = {}) {
    if (!active) {
      return { key: "inactive", label: "语音未启用", affectsOverall: false };
    }
    if (peerCount <= 0) {
      return { key: "waiting", label: "语音等待连接", affectsOverall: false };
    }
    if (!supported) {
      return { key: "unavailable", label: "语音统计不可用", affectsOverall: false };
    }
    if (!hasSamples) {
      return { key: "waiting", label: "语音数据收集中", affectsOverall: false };
    }

    const loss = finiteNumber(lossPercent);
    const jitter = finiteNumber(jitterMs);
    if (loss === null && jitter === null) {
      return { key: "unavailable", label: "语音数据暂不可用", affectsOverall: false };
    }

    const detail = [
      loss === null ? null : `丢包 ${roundMetric(loss, 1)}%`,
      jitter === null ? null : `抖动 ${roundMetric(jitter)} ms`,
    ].filter(Boolean).join(" · ");

    if ((loss !== null && loss >= 3) || (jitter !== null && jitter >= 60)) {
      return { key: "poor", label: `语音不稳 · ${detail}`, affectsOverall: true };
    }
    if ((loss !== null && loss >= 1) || (jitter !== null && jitter >= 30)) {
      return { key: "good", label: `语音波动 · ${detail}`, affectsOverall: true };
    }
    return { key: "excellent", label: `语音稳定 · ${detail}`, affectsOverall: true };
  }

  function deriveVoiceSample({ packetsLost, deliveredPackets, jitterMs } = {}, previous = null) {
    const lost = finiteNumber(packetsLost);
    const delivered = finiteNumber(deliveredPackets);
    const jitter = finiteNumber(jitterMs);
    let lossPercent = null;
    if (previous && lost !== null && delivered !== null && previous.packetsLost !== null && previous.deliveredPackets !== null) {
      const lostDelta = lost - previous.packetsLost;
      const deliveredDelta = delivered - previous.deliveredPackets;
      const totalDelta = lostDelta + deliveredDelta;
      if (lostDelta >= 0 && deliveredDelta >= 0 && totalDelta > 0) {
        lossPercent = (lostDelta / totalDelta) * 100;
      }
    }
    return { lossPercent, jitterMs: jitter };
  }

  function chooseOverallQuality(server, voice) {
    if (!voice?.affectsOverall) {
      return server;
    }
    if (QUALITY_RANK[voice.key] < QUALITY_RANK[server.key]) {
      return { key: voice.key, label: voice.key === "poor" ? "较差" : "良好", bars: voice.key === "poor" ? 1 : 3 };
    }
    return server;
  }

  function formatLatency(rttMs) {
    const rtt = finiteNumber(rttMs);
    if (rtt === null || rtt < 0) return "-- ms";
    return `${Math.max(1, Math.round(rtt))} ms`;
  }

  function buildLatencyTrend(samples = []) {
    const recent = samples.slice(-24).map(value => {
      const number = finiteNumber(value);
      return number !== null && number >= 0 ? number : null;
    });
    const maximum = Math.max(10, ...recent.filter(value => value !== null));
    let path = "";
    let gap = true;
    recent.forEach((value, index) => {
      if (value === null) { gap = true; return; }
      const x = 2 + (24 - recent.length + index) * (52 / 23);
      const y = 18 - (value / maximum) * 16;
      path += `${gap ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
      gap = false;
    });
    return { path: path.trim(), maximum };
  }

  function buildNetworkPresentation({ connected, rttMs, failures = 0, waitingMs = null, voice } = {}) {
    const waiting = finiteNumber(waitingMs);
    const measuredRtt = waiting === null ? rttMs : Math.max(finiteNumber(rttMs) ?? 0, waiting);
    const server = classifyServerQuality({ connected, rttMs: measuredRtt, failures });
    const voiceQuality = classifyVoiceQuality(voice);
    const overall = chooseOverallQuality(server, voiceQuality);
    return {
      overall,
      server,
      voice: voiceQuality,
      label: `网络${overall.label}`,
      latencyText: server.key === "offline" ? "-- ms" : waiting === null ? formatLatency(rttMs) : `≥${Math.floor(waiting)} ms`,
      voiceText: voiceQuality.label,
    };
  }

  global.WerewolfNetworkQuality = {
    buildNetworkPresentation,
    classifyServerQuality,
    classifyVoiceQuality,
    deriveVoiceSample,
    formatLatency,
    buildLatencyTrend,
    roundMetric,
  };
})(window);
