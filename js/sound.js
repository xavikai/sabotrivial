// Efectes de so sintetitzats amb WebAudio (no cal descarregar res)
(function (root) {
  let ctx = null;
  let muted = localStorage.getItem('tp_muted') === '1';

  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur = 0.12, type = 'sine', vol = 0.18, when = 0, slide = 0) {
    if (muted) return;
    const c = ac(); if (!c) return;
    const t = c.currentTime + when;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  const Sound = {
    get muted() { return muted; },
    toggle() { muted = !muted; localStorage.setItem('tp_muted', muted ? '1' : '0'); if (!muted) this.click(); return muted; },
    unlock() { ac(); },
    click() { tone(660, 0.05, 'triangle', 0.12); },
    hop() { tone(520 + Math.random() * 80, 0.07, 'square', 0.06); },
    dice() { for (let i = 0; i < 8; i++) tone(300 + Math.random() * 500, 0.04, 'square', 0.05, i * 0.07); },
    good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, 'triangle', 0.16, i * 0.08)); },
    bad() { tone(300, 0.35, 'sawtooth', 0.12, 0, -180); tone(220, 0.4, 'sawtooth', 0.08, 0.12, -120); },
    attack() { tone(900, 0.35, 'sawtooth', 0.09, 0, -700); },
    card() { tone(880, 0.08, 'triangle', 0.12); tone(1320, 0.1, 'triangle', 0.12, 0.08); },
    tick() { tone(1000, 0.03, 'square', 0.05); },
    turn() { tone(587, 0.1, 'triangle', 0.14); tone(880, 0.16, 'triangle', 0.14, 0.1); },
    win() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.22, 'triangle', 0.18, i * 0.13)); }
  };
  root.Sound = Sound;
})(window);
