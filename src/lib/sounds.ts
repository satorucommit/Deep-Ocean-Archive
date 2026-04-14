// ============================================
// DEEP OCEAN - WEB AUDIO API SOUND UTILITIES
// ============================================

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function playSonarPing() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Audio not supported
  }
}

export function playBubbleSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const envelope = Math.exp(-t * 30);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.06;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, ctx.currentTime);
    
    source.connect(filter);
    filter.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch (e) {
    // Audio not supported
  }
}

export function playDepthMilestone(depth: number) {
  try {
    const ctx = getAudioContext();
    
    // Different tones for different depth milestones
    const baseFreq = depth < 500 ? 200 : depth < 2000 ? 150 : depth < 5000 ? 100 : 60;
    const duration = 1.5;
    
    // Create a deep resonant tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + duration);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio not supported
  }
}

export function playDiscoverySound() {
  try {
    const ctx = getAudioContext();
    
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const duration = 0.15;
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * duration);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * duration);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * duration + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * duration + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + i * duration);
      osc.stop(ctx.currentTime + i * duration + 0.3);
    });
  } catch (e) {
    // Audio not supported
  }
}

export function playPressureCreak() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const envelope = Math.exp(-t * 6);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.04 +
                 Math.sin(t * 200 * (1 - t * 2)) * envelope * 0.06;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    
    source.connect(filter);
    filter.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch (e) {
    // Audio not supported
  }
}

export function startAmbientHum(): () => void {
  try {
    const ctx = getAudioContext();
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(40, ctx.currentTime);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(42, ctx.currentTime);
    
    // Beat frequency creates subtle pulsing
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    
    return () => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
        }, 600);
      } catch (e) { /* already stopped */ }
    };
  } catch (e) {
    return () => {};
  }
}

export function playWhaleSong() {
  try {
    const ctx = getAudioContext();
    const duration = 3;
    const now = ctx.currentTime;
    
    // Create a modulated whale-like tone
    const osc = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const mainGain = ctx.createGain();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(180, now + 1);
    osc.frequency.linearRampToValueAtTime(140, now + 2);
    osc.frequency.linearRampToValueAtTime(100, now + duration);
    
    // Amplitude modulation
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(3, now);
    modGain.gain.setValueAtTime(0.5, now);
    
    // Vibrato
    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(5, now);
    vibratoGain.gain.setValueAtTime(5, now);
    
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.06, now + 0.2);
    mainGain.gain.setValueAtTime(0.06, now + duration - 0.3);
    mainGain.gain.linearRampToValueAtTime(0, now + duration);
    
    modulator.connect(modGain);
    modGain.connect(mainGain.gain);
    
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    
    osc.connect(mainGain);
    mainGain.connect(ctx.destination);
    
    osc.start(now);
    modulator.start(now);
    vibrato.start(now);
    
    osc.stop(now + duration);
    modulator.stop(now + duration);
    vibrato.stop(now + duration);
  } catch (e) {
    // Audio not supported
  }
}
