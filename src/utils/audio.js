// Synthesized Web Audio engine - 100% offline, zero-latency, 0KB assets

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("zena_sound_enabled") !== "false";
}

export function setSoundEnabled(enabled) {
  if (typeof window === "undefined") return;
  localStorage.setItem("zena_sound_enabled", enabled ? "true" : "false");
}

export function playTapSound(isMarking = true) {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;

    if (isMarking) {
      // Crisp upbeat pop
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    } else {
      // Soft gentle unmark tone
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  } catch {
    // Non-blocking fallback
  }
}

export function playWinFanfare() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Victory arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz), with sustained final chord
    const notes = [
      { freq: 523.25, delay: 0.0, dur: 0.15 },
      { freq: 659.25, delay: 0.12, dur: 0.15 },
      { freq: 783.99, delay: 0.24, dur: 0.18 },
      { freq: 1046.5, delay: 0.38, dur: 0.55 },
      { freq: 1318.5, delay: 0.42, dur: 0.50 }, // Harmony on final triumphant chord
    ];

    const start = ctx.currentTime;

    notes.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start + delay);

      gain.gain.setValueAtTime(0.001, start + delay);
      gain.gain.linearRampToValueAtTime(0.28, start + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + delay + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start + delay);
      osc.stop(start + delay + dur);
    });
  } catch {
    // Non-blocking fallback
  }
}

export function playClearSound() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // Non-blocking fallback
  }
}

export function playDiceSound() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.05, 0.1, 0.16].forEach((timeOffset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(600 + idx * 120, now + timeOffset);

      gain.gain.setValueAtTime(0.08, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.05);
    });
  } catch {
    // Non-blocking fallback
  }
}

