// ─── Web Audio API Sound Engine — Zero External File Latency ─────────────────
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// 🎣 1. Olta Savurma Sesi (Cast Whoosh & Line Whistle)
export function playCastSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // White noise whoosh
    const bufferSize = ctx.sampleRate * 0.35
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12))
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(400, now)
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.18)
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.35)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.35, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start(now)
  } catch { /* ignore */ }
}

// 💦 2. Su Şapırtısı (Water Splash)
export function playSplashSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1600, now)
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.35)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start(now)

    // Bubble pop overtone
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(280, now + 0.04)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15)
    oscGain.gain.setValueAtTime(0.15, now + 0.04)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    osc.start(now + 0.04)
    osc.stop(now + 0.22)
  } catch { /* ignore */ }
}

// ⚙️ 3. Makara Sarma Sesi (Reel Cranking Mechanical Click)
export function playReelSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    for (let k = 0; k < 3; k++) {
      const t = now + k * 0.08
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200 + k * 120, t)
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.03)

      gain.gain.setValueAtTime(0.15, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.035)
    }
  } catch { /* ignore */ }
}

// 🔔 4. Balık Vuruşu / Isırık Çanı (Bite Alert Bell)
export function playBiteSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [1480, 1760]
    notes.forEach((freq, i) => {
      const t = now + i * 0.09
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.2)
    })
  } catch { /* ignore */ }
}

// 🏆 5. Büyük Ödül / Kazanma Fanfarı (Win Arpeggio & Chime)
export function playWinSound(isBigWin = false) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const chords = isBigWin 
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // C Major 6-note
      : [523.25, 659.25, 783.99, 1046.50] // C Major 4-note

    chords.forEach((freq, idx) => {
      const t = now + idx * 0.07
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0.01, t)
      gain.gain.linearRampToValueAtTime(0.28, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + (isBigWin ? 0.7 : 0.45))

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + (isBigWin ? 0.75 : 0.5))
    })
  } catch { /* ignore */ }
}
