'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DEPTH_ZONES, CREATURES, EXPEDITIONS, PRESSURE_OBJECTS, SOUNDSCAPES,
  getZoneForDepth, getCreaturesForZone, getConservationLabel, getConservationColor,
  calculatePressure, calculateTemperature,
  type Creature, type Expedition,
} from '@/lib/deep-ocean-data';
import {
  playSonarPing, playBubbleSound, playDepthMilestone, playDiscoverySound,
  playPressureCreak, startAmbientHum, playWhaleSong,
} from '@/lib/sounds';

// ============================================
// PARTICLE SYSTEM COMPONENT
// ============================================
function ParticleCanvas({ depth, isLightOn }: { depth: number; isLightOn: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number; y: number; size: number; speed: number; opacity: number;
    drift: number; glow: boolean;
  }>>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const count = 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
      glow: Math.random() > 0.7,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const depthFactor = Math.min(1, depth / 11000);
      const particleOpacity = 0.15 + depthFactor * 0.4;
      const glowIntensity = depth > 500 ? Math.min(1, (depth - 500) / 2000) : 0;

      particlesRef.current.forEach(p => {
        // Update position - particles drift upward like marine snow
        p.y -= p.speed;
        p.x += p.drift + Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.2;

        // Wrap around
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const finalOpacity = p.opacity * particleOpacity;

        if (p.glow && glowIntensity > 0) {
          // Bioluminescent particle
          const glowSize = p.size * 4;
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          const hue = 170 + Math.sin(Date.now() * 0.002 + p.x) * 20;
          gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${finalOpacity * glowIntensity})`);
          gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core particle
        ctx.fillStyle = `rgba(180, 220, 255, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [depth, isLightOn]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// ============================================
// HUD COMPONENT
// ============================================
function HUD({
  depth, isLightOn, setIsLightOn, soundEnabled, setSoundEnabled,
  discoveries, setShowDiscoveryLog, stopAmbient,
}: {
  depth: number;
  isLightOn: boolean;
  setIsLightOn: (v: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  discoveries: string[];
  setShowDiscoveryLog: (v: boolean) => void;
  stopAmbient: () => void;
}) {
  const pressure = calculatePressure(depth);
  const temperature = calculateTemperature(depth);
  const zone = getZoneForDepth(depth);

  const milestones = [200, 1000, 4000, 6000, 11000];

  return (
    <>
      <div className="hud-container scanlines">
        <div className="flex items-start justify-between">
          {/* Left - Depth & Pressure */}
          <div className="flex flex-col gap-1">
            <div className="depth-display">{Math.round(depth).toLocaleString()}</div>
            <div className="depth-unit">METERS DEPTH</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="pressure-display">
                <span className="pressure-value">{pressure.toLocaleString()}</span>
                <span className="pressure-unit ml-1">ATM</span>
              </div>
              <div className="temperature-display">
                {temperature.toFixed(1)}°C
              </div>
            </div>
            {zone && (
              <div className="zone-indicator mt-2">
                {zone.name.toUpperCase()} — {zone.nameLat}
              </div>
            )}
          </div>

          {/* Right - Controls */}
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <button
                className={`hud-btn info-tooltip ${isLightOn ? 'active' : ''}`}
                data-tooltip={isLightOn ? 'Light On' : 'Light Off'}
                onClick={() => {
                  setIsLightOn(!isLightOn);
                  if (!isLightOn) playSonarPing();
                }}
              >
                💡
              </button>
              <button
                className={`hud-btn info-tooltip ${soundEnabled ? 'active' : ''}`}
                data-tooltip={soundEnabled ? 'Sound On' : 'Sound Off'}
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (soundEnabled) stopAmbient();
                }}
              >
                🔊
              </button>
              <button
                className="hud-btn info-tooltip relative"
                data-tooltip="Discovery Log"
                onClick={() => setShowDiscoveryLog(true)}
              >
                📖
                {discoveries.length > 0 && (
                  <span className="species-badge">{discoveries.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Depth Progress Bar */}
      <div className="depth-progress">
        <div
          className="depth-progress-fill"
          style={{ height: `${Math.min(100, (depth / 11000) * 100)}%` }}
        />
        {milestones.map(m => (
          <div key={m} style={{ top: `${(m / 11000) * 100}%` }}>
            <div className={`depth-progress-dot ${depth >= m ? 'passed' : ''}`} />
            <div className="depth-progress-marker">{m}m</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection({ onStartDive }: { onStartDive: () => void }) {
  const [showText, setShowText] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section className="hero-section" id="hero">
      {/* Bioluminescent pulse */}
      <div className="hero-pulse flex items-center justify-center">
        <div className="hero-pulse-inner" />
        <div className="sonar-ring" />
        <div className="sonar-ring" />
        <div className="sonar-ring" />
      </div>

      {/* Text */}
      {showText && (
        <div className="absolute flex flex-col items-center gap-6 mt-64">
          <h1 className="hero-subtitle text-xs sm:text-sm md:text-base">
            DEEP OCEAN INTELLIGENCE ARCHIVE
          </h1>
          <p className="hero-text text-sm sm:text-base md:text-lg text-center px-4 max-w-lg">
            Take a breath. You won&apos;t need it.
          </p>
          <button
            className="mt-4 px-8 py-3 border border-[rgba(0,255,209,0.3)] rounded-full text-[#00FFD1] font-['Space_Mono'] text-xs tracking-[0.2em] hover:bg-[rgba(0,255,209,0.1)] transition-all hover:shadow-[0_0_30px_rgba(0,255,209,0.2)]"
            style={{ animation: 'fadeInUp 1s ease-out 2.5s both' }}
            onClick={() => {
              setStarted(true);
              onStartDive();
            }}
          >
            BEGIN DESCENT →
          </button>
        </div>
      )}

      {/* Scroll indicator */}
      {started && (
        <div className="scroll-indicator flex flex-col items-center gap-2">
          <span className="text-[rgba(0,255,209,0.4)] font-['Space_Mono'] text-[10px] tracking-[0.2em]">
            SCROLL TO DIVE
          </span>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="rgba(0,255,209,0.3)" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" fill="#00FFD1">
              <animate attributeName="cy" values="8;20;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}
    </section>
  );
}

// ============================================
// CREATURE CARD COMPONENT
// ============================================
function CreatureCard({
  creature, onDiscover, isDiscovered, depth,
}: {
  creature: Creature;
  onDiscover: (id: string) => void;
  isDiscovered: boolean;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isBioLight, setIsBioLight] = useState(false);
  const isEndangered = ['EN', 'CR'].includes(creature.conservationStatus);
  const isVulnerable = isEndangered || creature.conservationStatus === 'VU';

  const handleCardClick = useCallback(() => {
    if (!isDiscovered) {
      onDiscover(creature.id);
    }
    setExpanded(!expanded);
    playBubbleSound();
  }, [creature.id, expanded, isDiscovered, onDiscover]);

  return (
    <>
      <div
        className={`creature-card ${isVulnerable ? 'creature-card-endangered' : ''} ${isDiscovered ? '' : 'opacity-70'} buoyancy-drift`}
        onClick={handleCardClick}
        style={{ animationDelay: `${Math.random() * 3}s` }}
      >
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl float-slow" role="img" aria-label={creature.commonName}>
                {creature.emoji}
              </span>
              <div>
                <h3 className="font-['Orbitron'] text-sm sm:text-base font-bold text-white">
                  {creature.commonName}
                </h3>
                <p className="font-['Space_Mono'] text-[11px] sm:text-xs italic text-[#00FFD1]">
                  {creature.scientificName}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className="conservation-badge"
                style={{
                  background: `${getConservationColor(creature.conservationStatus)}20`,
                  color: getConservationColor(creature.conservationStatus),
                  border: `1px solid ${getConservationColor(creature.conservationStatus)}40`,
                }}
              >
                {creature.conservationStatus}
              </span>
              {isDiscovered && (
                <span className="text-[10px] text-[#00FFD1] font-['Space_Mono']">✓ LOGGED</span>
              )}
            </div>
          </div>

          {/* Preview */}
          <p className="font-['Space_Mono'] text-[11px] sm:text-xs text-[rgba(255,255,255,0.5)] leading-relaxed line-clamp-2 mb-3">
            {creature.description.slice(0, 100)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] px-2 py-1 rounded bg-[rgba(0,255,209,0.05)] text-[rgba(0,255,209,0.6)] border border-[rgba(0,255,209,0.1)] font-['Space_Mono']">
              {creature.depthRange[0]}–{creature.depthRange[1]}m
            </span>
            <span className="text-[10px] px-2 py-1 rounded bg-[rgba(255,179,71,0.05)] text-[rgba(255,179,71,0.6)] border border-[rgba(255,179,71,0.1)] font-['Space_Mono']">
              {creature.size}
            </span>
            {creature.bioluminescent && (
              <span className="text-[10px] px-2 py-1 rounded bg-[rgba(0,255,209,0.1)] text-[#00FFD1] border border-[rgba(0,255,209,0.2)] font-['Space_Mono']">
                ✦ BIOLUMINESCENT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Detail Panel */}
      {expanded && (
        <>
          <div className="overlay-backdrop" onClick={() => setExpanded(false)} />
          <CreatureDetailPanel
            creature={creature}
            onClose={() => setExpanded(false)}
            isBioLight={isBioLight}
            setIsBioLight={setIsBioLight}
            isDiscovered={isDiscovered}
          />
        </>
      )}
    </>
  );
}

// ============================================
// CREATURE DETAIL PANEL
// ============================================
function CreatureDetailPanel({
  creature, onClose, isBioLight, setIsBioLight, isDiscovered,
}: {
  creature: Creature;
  onClose: () => void;
  isBioLight: boolean;
  setIsBioLight: (v: boolean) => void;
  isDiscovered: boolean;
}) {
  return (
    <div className="creature-detail-panel deep-scroll">
      {/* Close button */}
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-[rgba(5,10,14,0.95)] border-b border-[rgba(0,255,209,0.1)]">
        <span className="text-xs font-['Space_Mono'] text-[rgba(0,255,209,0.5)] tracking-[0.15em]">SPECIMEN DATA</span>
        <button onClick={onClose} className="hud-btn w-8 h-8 text-sm">✕</button>
      </div>

      <div className="p-5">
        {/* Creature visual */}
        <div className={`relative flex items-center justify-center py-10 rounded-2xl mb-5 transition-all ${isBioLight ? 'bg-[rgba(0,20,15,0.8)]' : 'bg-[rgba(0,0,0,0.5)]'}`}>
          <span className="text-7xl sm:text-8xl float-slow" role="img" aria-label={creature.commonName}>
            {creature.emoji}
          </span>
          {creature.bioluminescent && (
            <>
              {isBioLight && (
                <div className="absolute inset-0 rounded-2xl" style={{
                  background: 'radial-gradient(circle, rgba(0,255,209,0.1) 0%, transparent 60%)',
                }} />
              )}
              <button
                className="absolute top-3 right-3 bio-toggle"
                onClick={() => setIsBioLight(!isBioLight)}
                aria-label="Toggle bioluminescence"
              />
              <span className="absolute top-3 right-16 text-[9px] text-[rgba(0,255,209,0.5)] font-['Space_Mono']">BIO-LIGHT</span>
            </>
          )}

          {/* Sonar rings */}
          <div className="sonar-ring" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div className="sonar-ring" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        </div>

        {/* Name */}
        <h2 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white mb-1">
          {creature.commonName}
        </h2>
        <p className="font-['Space_Mono'] text-sm italic text-[#00FFD1] mb-1">
          {creature.scientificName}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="conservation-badge"
            style={{
              background: `${getConservationColor(creature.conservationStatus)}20`,
              color: getConservationColor(creature.conservationStatus),
              border: `1px solid ${getConservationColor(creature.conservationStatus)}40`,
            }}
          >
            {getConservationLabel(creature.conservationStatus)}
          </span>
          {isDiscovered && (
            <span className="text-[10px] text-[#00FFD1] font-['Space_Mono']">✓ IN DISCOVERY LOG</span>
          )}
        </div>

        {/* Description */}
        <p className="font-['Space_Mono'] text-xs text-[rgba(255,255,255,0.7)] leading-relaxed mb-5">
          {creature.description}
        </p>

        {/* Data grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'DEPTH RANGE', value: `${creature.depthRange[0]}–${creature.depthRange[1]}m` },
            { label: 'SIZE', value: creature.size },
            { label: 'DIET', value: creature.diet },
            { label: 'DISCOVERED', value: creature.firstDiscovered },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-lg bg-[rgba(0,255,209,0.03)] border border-[rgba(0,255,209,0.08)]">
              <div className="text-[9px] text-[rgba(0,255,209,0.4)] font-['Space_Mono'] tracking-[0.1em] mb-1">{item.label}</div>
              <div className="text-xs text-[rgba(255,255,255,0.8)] font-['Space_Mono']">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Fun fact */}
        <div className="p-4 rounded-xl bg-[rgba(255,179,71,0.05)] border border-[rgba(255,179,71,0.15)]">
          <div className="text-[9px] text-[rgba(255,179,71,0.5)] font-['Space_Mono'] tracking-[0.1em] mb-1">DID YOU KNOW?</div>
          <p className="text-xs text-[rgba(255,255,255,0.8)] font-['Space_Mono']">{creature.funFact}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEPTH ZONE SECTION
// ============================================
function DepthZoneSection({
  zone, onDiscover, discoveries, soundEnabled,
}: {
  zone: typeof DEPTH_ZONES[0];
  onDiscover: (id: string) => void;
  discoveries: string[];
  soundEnabled: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const creatures = getCreaturesForZone(zone.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="depth-zone-section relative"
      style={{ background: zone.bgGradient }}
      id={`zone-${zone.id}`}
    >
      {/* Zone Header */}
      <div className={`reveal-section ${visible ? 'visible' : ''} text-center mb-12 relative z-10`}>
        <div className="font-['Space_Mono'] text-[10px] text-[rgba(0,255,209,0.4)] tracking-[0.3em] mb-2">
          DEPTH {zone.depthRange[0]}–{zone.depthRange[1]}M
        </div>
        <h2 className="zone-title text-2xl sm:text-3xl md:text-4xl text-white mb-2">
          {zone.name}
        </h2>
        <p className="zone-latin-name text-xs sm:text-sm text-[rgba(0,255,209,0.5)] mb-4">
          {zone.nameLat}
        </p>
        <p className="max-w-2xl mx-auto font-['Space_Mono'] text-[11px] sm:text-xs text-[rgba(255,255,255,0.5)] leading-relaxed px-4">
          {zone.description}
        </p>

        {/* Zone stats */}
        <div className="flex justify-center gap-6 mt-6 flex-wrap">
          <div className="text-center">
            <div className="font-['Orbitron'] text-lg text-[#FFB347]">{zone.pressure}</div>
            <div className="font-['Space_Mono'] text-[9px] text-[rgba(255,179,71,0.5)] tracking-[0.1em]">PRESSURE</div>
          </div>
          <div className="text-center">
            <div className="font-['Orbitron'] text-lg text-[rgba(100,180,255,0.8)]">{zone.temperature}</div>
            <div className="font-['Space_Mono'] text-[9px] text-[rgba(100,180,255,0.4)] tracking-[0.1em]">TEMPERATURE</div>
          </div>
        </div>
      </div>

      {/* Zone Facts */}
      <div className={`reveal-section ${visible ? 'visible' : ''} max-w-2xl mx-auto mb-12 relative z-10`} style={{ transitionDelay: '0.2s' }}>
        <div className="p-4 rounded-xl bg-[rgba(5,10,14,0.6)] border border-[rgba(0,255,209,0.08)] backdrop-blur-sm">
          <div className="font-['Space_Mono'] text-[9px] text-[rgba(0,255,209,0.4)] tracking-[0.15em] mb-3">ZONE INTELLIGENCE</div>
          {zone.facts.map((fact, i) => (
            <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
              <span className="text-[#00FFD1] text-[10px] mt-0.5">▸</span>
              <span className="font-['Space_Mono'] text-[11px] text-[rgba(255,255,255,0.6)]">{fact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Creature Grid */}
      <div className={`reveal-section ${visible ? 'visible' : ''} w-full max-w-5xl mx-auto relative z-10`} style={{ transitionDelay: '0.4s' }}>
        <div className="font-['Space_Mono'] text-[9px] text-[rgba(0,255,209,0.4)] tracking-[0.2em] mb-4 px-2">
          SPECIES CATALOG — {creatures.length} ENTRIES
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creatures.map(creature => (
            <CreatureCard
              key={creature.id}
              creature={creature}
              onDiscover={onDiscover}
              isDiscovered={discoveries.includes(creature.id)}
              depth={0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRESSURE LAB SECTION
// ============================================
function PressureLabSection({ soundEnabled }: { soundEnabled: boolean }) {
  const [pressureDepth, setPressureDepth] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDepthChange = useCallback((newDepth: number) => {
    const clamped = Math.max(0, Math.min(11000, newDepth));
    setPressureDepth(clamped);
  }, []);

  const handleMouseDown = useCallback(() => { isDragging.current = true; }, []);
  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      handleDepthChange(x * 11000);
      if (soundEnabled && Math.random() > 0.8) playPressureCreak();
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
      handleDepthChange(x * 11000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleDepthChange, soundEnabled]);

  const getEffectText = (obj: typeof PRESSURE_OBJECTS[0]) => {
    const depths = Object.keys(obj.effects).map(Number).sort((a, b) => a - b);
    const applicable = depths.filter(d => pressureDepth >= d);
    if (applicable.length === 0) return obj.effects[0];
    return obj.effects[applicable[applicable.length - 1]];
  };

  const getObjectScale = (obj: typeof PRESSURE_OBJECTS[0]) => {
    if (obj.collapseDepth === 0) return { scale: 1 - (pressureDepth / 11000) * 0.85, scaleY: 1 + (pressureDepth / 11000) * 0.5, destroyed: false, crushed: false };
    const ratio = pressureDepth / obj.collapseDepth;
    if (ratio >= 1.5) return { scale: 0.1, scaleY: 3, destroyed: true };
    if (ratio >= 1) return { scale: 0.3, scaleY: 1.5, destroyed: false, crushed: true };
    return { scale: 1 - ratio * 0.4, scaleY: 1 + ratio * 0.3, destroyed: false, crushed: false };
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #010102 0%, #000 50%, #010102 100%)' }}
      id="pressure-lab"
    >
      <div className={`reveal-section ${visible ? 'visible' : ''} max-w-4xl mx-auto`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="font-['Space_Mono'] text-[10px] text-[rgba(255,68,68,0.5)] tracking-[0.3em] mb-2">INTERACTIVE SIMULATION</div>
          <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 30px rgba(255,68,68,0.3)' }}>
            PRESSURE LAB
          </h2>
          <p className="font-['Space_Mono'] text-xs text-[rgba(255,255,255,0.4)] max-w-lg mx-auto">
            What happens to objects as they descend? Drag the slider to simulate crushing ocean pressure.
          </p>
        </div>

        {/* Depth Slider */}
        <div className="mb-10 px-4">
          <div className="flex justify-between mb-2">
            <span className="font-['Space_Mono'] text-[10px] text-[rgba(0,255,209,0.4)]">0m — Surface</span>
            <span className="font-['Orbitron'] text-lg text-[#00FFD1]">{pressureDepth.toLocaleString()}m</span>
            <span className="font-['Space_Mono'] text-[10px] text-[rgba(255,68,68,0.4)]">11,000m — Trench</span>
          </div>
          <div
            ref={sliderRef}
            className="pressure-slider-track"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div
              className="pressure-slider-thumb"
              style={{ left: `${(pressureDepth / 11000) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-['Space_Mono'] text-[10px] text-[rgba(255,179,71,0.4)]">
              {calculatePressure(pressureDepth).toLocaleString()} atm
            </span>
          </div>
        </div>

        {/* Objects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRESSURE_OBJECTS.map(obj => {
            const scaleData = getObjectScale(obj);
            return (
              <div key={obj.id} className="text-center p-4 rounded-xl bg-[rgba(5,10,14,0.6)] border border-[rgba(255,68,68,0.1)]">
                <div
                  className={`pressure-object mx-auto mb-3 h-20 ${scaleData.crushed ? 'crushed' : ''} ${scaleData.destroyed ? 'destroyed' : ''}`}
                  style={{
                    transform: scaleData.destroyed
                      ? `scale(${scaleData.scale}, ${scaleData.scaleY})`
                      : scaleData.crushed
                        ? `scale(${scaleData.scale}, ${scaleData.scaleY})`
                        : `scale(${scaleData.scale}, ${scaleData.scaleY})`,
                  }}
                >
                  <span className="text-5xl">{obj.icon}</span>
                </div>
                <div className="font-['Orbitron'] text-xs text-white mb-1">{obj.name}</div>
                <p className="font-['Space_Mono'] text-[10px] text-[rgba(255,255,255,0.4)] leading-relaxed">
                  {getEffectText(obj)}
                </p>
                {scaleData.destroyed && (
                  <div className="mt-2 text-[10px] text-[#FF4444] font-['Space_Mono'] animate-pulse">■ DESTROYED</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// EXPEDITION TIMELINE
// ============================================
function ExpeditionTimeline({ soundEnabled }: { soundEnabled: boolean }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #010102 0%, #000 50%, #000 100%)' }}
      id="expeditions"
    >
      <div className={`reveal-section ${visible ? 'visible' : ''} max-w-5xl mx-auto`}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="font-['Space_Mono'] text-[10px] text-[rgba(0,255,209,0.4)] tracking-[0.3em] mb-2">HISTORICAL ARCHIVE</div>
          <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 30px rgba(0,255,209,0.3)' }}>
            EXPEDITION LOG
          </h2>
          <p className="font-['Space_Mono'] text-xs text-[rgba(255,255,255,0.4)] max-w-lg mx-auto">
            The vehicles and missions that revealed the deepest places on Earth.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line - mobile: left aligned */}
          <div className="timeline-line hidden sm:block" />
          <div className="absolute left-[1.125rem] sm:hidden top-0 bottom-0 w-[2px] bg-gradient-to-b from-[rgba(0,255,209,0.1)] via-[rgba(0,255,209,0.3)] to-[rgba(0,255,209,0.1)]" />

          {EXPEDITIONS.map((exp: Expedition, index: number) => (
            <div
              key={exp.id}
              className={`reveal-section ${visible ? 'visible' : ''} relative mb-12 last:mb-0`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              {/* Node */}
              <div className="absolute left-[0.375rem] sm:left-1/2 sm:-translate-x-1/2 top-6">
                <div className="timeline-node" style={{ position: 'relative' }} />
              </div>

              {/* Card */}
              <div className={`ml-10 sm:ml-0 sm:w-[45%] ${index % 2 === 0 ? 'sm:mr-auto sm:pr-12' : 'sm:ml-auto sm:pl-12'}`}>
                <div
                  className="timeline-card"
                  onClick={() => { if (soundEnabled) playSonarPing(); }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-['Orbitron'] text-lg font-bold text-[#00FFD1]">{exp.year}</span>
                    <span className="text-[10px]">{exp.country}</span>
                  </div>
                  <h3 className="font-['Orbitron'] text-sm font-bold text-white mb-1">{exp.name}</h3>
                  <div className="font-['Space_Mono'] text-[10px] text-[#FFB347] mb-2">{exp.vehicle}</div>
                  <p className="font-['Space_Mono'] text-[11px] text-[rgba(255,255,255,0.5)] leading-relaxed mb-3">
                    {exp.description}
                  </p>
                  <div className="p-2 rounded-lg bg-[rgba(0,255,209,0.03)] border border-[rgba(0,255,209,0.08)]">
                    <div className="font-['Space_Mono'] text-[9px] text-[rgba(0,255,209,0.4)] tracking-[0.1em] mb-0.5">ACHIEVEMENT</div>
                    <div className="font-['Space_Mono'] text-[10px] text-[rgba(255,255,255,0.7)]">{exp.achievement}</div>
                  </div>
                  <div className="mt-2 font-['Space_Mono'] text-[10px] text-[rgba(255,179,71,0.5)]">
                    MAX DEPTH: {exp.maxDepth.toLocaleString()}m
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// ACOUSTIC MAPPING SECTION
// ============================================
function AcousticMappingSection({ soundEnabled }: { soundEnabled: boolean }) {
  const [visible, setVisible] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>(new Array(64).fill(2));
  const sectionRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate waveform
  useEffect(() => {
    if (!activeSoundscape) {
      setBars(new Array(64).fill(2));
      return;
    }

    const soundscape = SOUNDSCAPES.find(s => s.id === activeSoundscape);
    if (!soundscape) return;

    const animate = () => {
      const newBars = new Array(64).fill(0).map((_, i) => {
        const base = soundscape.frequency;
        const variation = Math.sin(Date.now() * 0.003 + i * 0.3) * 0.5 + 0.5;
        const noise = Math.random() * 0.3;
        const wave = Math.sin(i * 0.5 + Date.now() * 0.002) * 0.3 + 0.7;
        return Math.max(2, (variation + noise) * wave * 50);
      });
      setBars(newBars);
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [activeSoundscape]);

  const playSoundscape = (id: string) => {
    if (activeSoundscape === id) {
      setActiveSoundscape(null);
      return;
    }
    setActiveSoundscape(id);
    if (soundEnabled) {
      if (id === 'whale-song') playWhaleSong();
      else playSonarPing();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #000 0%, #010102 50%, #000 100%)' }}
      id="acoustic"
    >
      <div className={`reveal-section ${visible ? 'visible' : ''} max-w-4xl mx-auto`}>
        <div className="text-center mb-12">
          <div className="font-['Space_Mono'] text-[10px] text-[rgba(0,255,209,0.4)] tracking-[0.3em] mb-2">SOUND VISUALIZATION</div>
          <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 30px rgba(0,255,209,0.3)' }}>
            ACOUSTIC MAPPING ROOM
          </h2>
          <p className="font-['Space_Mono'] text-xs text-[rgba(255,255,255,0.4)] max-w-lg mx-auto">
            Visualize recorded ocean soundscapes as waveform art. Select a soundscape to begin.
          </p>
        </div>

        {/* Waveform display */}
        <div className="mb-8 p-6 rounded-2xl bg-[rgba(5,10,14,0.8)] border border-[rgba(0,255,209,0.1)] overflow-hidden">
          <div className="acoustic-waveform h-20 sm:h-24">
            {bars.map((height, i) => (
              <div
                key={i}
                className="acoustic-bar"
                style={{
                  height: `${height}px`,
                  opacity: activeSoundscape ? 0.6 + Math.random() * 0.4 : 0.2,
                  background: activeSoundscape
                    ? `hsl(${170 + (i / 64) * 30}, 100%, ${50 + (height / 50) * 20}%)`
                    : 'rgba(0,255,209,0.2)',
                }}
              />
            ))}
          </div>
          <div className="font-['Space_Mono'] text-[10px] text-[rgba(0,255,209,0.3)] text-center mt-2">
            {activeSoundscape ? `▶ PLAYING: ${SOUNDSCAPES.find(s => s.id === activeSoundscape)?.name}` : '● SELECT A SOUNDSCAPE'}
          </div>
        </div>

        {/* Soundscape buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SOUNDSCAPES.map(soundscape => (
            <button
              key={soundscape.id}
              className={`p-4 rounded-xl text-left transition-all ${
                activeSoundscape === soundscape.id
                  ? 'bg-[rgba(0,255,209,0.1)] border border-[rgba(0,255,209,0.3)] shadow-[0_0_20px_rgba(0,255,209,0.1)]'
                  : 'bg-[rgba(5,10,14,0.6)] border border-[rgba(0,255,209,0.08)] hover:border-[rgba(0,255,209,0.2)]'
              }`}
              onClick={() => playSoundscape(soundscape.id)}
            >
              <div className="font-['Orbitron'] text-xs font-bold text-white mb-1">{soundscape.name}</div>
              <div className="font-['Space_Mono'] text-[9px] text-[rgba(0,255,209,0.4)]">{soundscape.frequency}Hz base</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// DISCOVERY LOG PANEL
// ============================================
function DiscoveryLogPanel({
  discoveries, onClose, allCreatures,
}: {
  discoveries: string[];
  onClose: () => void;
  allCreatures: Creature[];
}) {
  const discovered = allCreatures.filter(c => discoveries.includes(c.id));

  return (
    <>
      <div className="overlay-backdrop" onClick={onClose} />
      <div className="discovery-log-panel open deep-scroll">
        <div className="sticky top-0 z-10 p-4 bg-[rgba(5,10,14,0.97)] border-b border-[rgba(0,255,209,0.1)] flex justify-between items-center">
          <div>
            <div className="font-['Orbitron'] text-sm font-bold text-white">Discovery Log</div>
            <div className="font-['Space_Mono'] text-[10px] text-[rgba(0,255,209,0.5)]">
              {discovered.length}/{allCreatures.length} SPECIES LOGGED
            </div>
          </div>
          <button onClick={onClose} className="hud-btn w-8 h-8 text-sm">✕</button>
        </div>

        {/* Progress */}
        <div className="p-4 border-b border-[rgba(0,255,209,0.05)]">
          <div className="h-2 rounded-full bg-[rgba(0,255,209,0.1)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(discovered.length / allCreatures.length) * 100}%`,
                background: 'linear-gradient(90deg, #00FFD1, #FFB347)',
              }}
            />
          </div>
          <div className="font-['Space_Mono'] text-[9px] text-[rgba(255,255,255,0.3)] mt-2 text-center">
            {discovered.length === allCreatures.length
              ? '🏆 COMPLETE CATALOG — ALL SPECIES DISCOVERED'
              : `${((discovered.length / allCreatures.length) * 100).toFixed(0)}% OF KNOWN SPECIES CATALOGED`}
          </div>
        </div>

        {/* Discovered species list */}
        <div className="p-4 space-y-2">
          {discovered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-3xl mb-3">🔬</div>
              <p className="font-['Space_Mono'] text-xs text-[rgba(255,255,255,0.3)]">No species logged yet.</p>
              <p className="font-['Space_Mono'] text-[10px] text-[rgba(255,255,255,0.2)] mt-1">Click on creature cards to log them.</p>
            </div>
          ) : (
            discovered.map(creature => (
              <div key={creature.id} className="discovery-entry flex items-center gap-3">
                <span className="text-2xl">{creature.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-['Orbitron'] text-xs text-white truncate">{creature.commonName}</div>
                  <div className="font-['Space_Mono'] text-[10px] italic text-[rgba(0,255,209,0.5)] truncate">
                    {creature.scientificName}
                  </div>
                </div>
                <span
                  className="conservation-badge shrink-0"
                  style={{
                    background: `${getConservationColor(creature.conservationStatus)}20`,
                    color: getConservationColor(creature.conservationStatus),
                  }}
                >
                  {creature.conservationStatus}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Undiscovered hint */}
        {discovered.length > 0 && discovered.length < allCreatures.length && (
          <div className="p-4 border-t border-[rgba(0,255,209,0.05)]">
            <div className="font-['Space_Mono'] text-[9px] text-[rgba(255,255,255,0.2)] text-center">
              {allCreatures.length - discovered.length} species remain undiscovered in the deep...
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// THREAT MAP SECTION
// ============================================
function ThreatMapSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const threats = [
    { name: 'Ocean Acidification', level: 85, color: '#FF4444', desc: 'pH has dropped 30% since pre-industrial era. Dissolving coral reefs and shellfish.' },
    { name: 'Temperature Anomaly', level: 72, color: '#FFB347', desc: 'Ocean surface temperatures have risen 0.88°C since 1900. Driving mass bleaching events.' },
    { name: 'Microplastic Pollution', level: 93, color: '#FF6B6B', desc: 'Over 8 million tons of plastic enter oceans annually. Found in the Mariana Trench.' },
    { name: 'Deep-Sea Mining', level: 45, color: '#FFA07A', desc: '15 exploration contracts for seabed minerals. Impacts still poorly understood.' },
    { name: 'Overfishing', level: 67, color: '#FF8C42', desc: '34% of fish stocks are biologically unsustainable. Deep-sea trawling destroys habitats.' },
    { name: 'Oxygen Depletion', level: 58, color: '#CD5C5C', desc: 'Ocean oxygen content has decreased 2% since 1960. "Dead zones" expanding globally.' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #000 0%, #0a0505 50%, #000 100%)' }}
      id="threats"
    >
      <div className={`reveal-section ${visible ? 'visible' : ''} max-w-4xl mx-auto`}>
        <div className="text-center mb-12">
          <div className="font-['Space_Mono'] text-[10px] text-[rgba(255,68,68,0.5)] tracking-[0.3em] mb-2">CRITICAL INTELLIGENCE</div>
          <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 30px rgba(255,68,68,0.3)' }}>
            THREAT MAP
          </h2>
          <p className="font-['Space_Mono'] text-xs text-[rgba(255,255,255,0.4)] max-w-lg mx-auto">
            The ocean is under siege. Real-time threat monitoring shows accelerating damage to Earth&apos;s largest ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {threats.map((threat, i) => (
            <div
              key={threat.name}
              className="reveal-section p-5 rounded-xl bg-[rgba(10,5,5,0.8)] border border-[rgba(255,68,68,0.1)] transition-all hover:border-[rgba(255,68,68,0.25)]"
              style={{
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-['Orbitron'] text-sm font-bold text-white">{threat.name}</h3>
                <span
                  className="font-['Orbitron'] text-lg font-bold"
                  style={{ color: threat.color, textShadow: `0 0 15px ${threat.color}40` }}
                >
                  {threat.level}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: visible ? `${threat.level}%` : '0%',
                    background: `linear-gradient(90deg, ${threat.color}80, ${threat.color})`,
                    boxShadow: `0 0 10px ${threat.color}40`,
                  }}
                />
              </div>
              <p className="font-['Space_Mono'] text-[10px] text-[rgba(255,255,255,0.4)] leading-relaxed">{threat.desc}</p>
            </div>
          ))}
        </div>

        {/* Urgent message */}
        <div className={`reveal-section mt-8 p-5 rounded-xl bg-[rgba(255,0,0,0.05)] border border-[rgba(255,0,0,0.15)] text-center`} style={{ transitionDelay: '0.6s' }}>
          <div className="text-2xl mb-2 animate-pulse">⚠</div>
          <p className="font-['Orbitron'] text-sm text-[#FF4444] mb-1">EXTINCTION URGENCY</p>
          <p className="font-['Space_Mono'] text-[10px] text-[rgba(255,255,255,0.4)]">
            We have explored less than 5% of the ocean. Species are going extinct before we even discover them.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function DeepOceanArchive() {
  const [depth, setDepth] = useState(0);
  const [isLightOn, setIsLightOn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [showDiscoveryLog, setShowDiscoveryLog] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  const stopAmbientRef = useRef<(() => void) | null>(null);
  const lastMilestoneRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track mouse for submarine light
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll-based depth tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!hasStarted) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      const newDepth = Math.round(scrollPercent * 11000);
      setDepth(newDepth);

      // Depth milestones
      const milestones = [200, 500, 1000, 2000, 3000, 4000, 6000, 8000, 11000];
      for (const m of milestones) {
        if (newDepth >= m && lastMilestoneRef.current < m) {
          lastMilestoneRef.current = m;
          if (soundEnabled) playDepthMilestone(m);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasStarted, soundEnabled]);

  // Sound management
  useEffect(() => {
    if (soundEnabled && hasStarted) {
      stopAmbientRef.current = startAmbientHum();
    } else {
      stopAmbientRef.current?.();
    }
    return () => { stopAmbientRef.current?.(); };
  }, [soundEnabled, hasStarted]);

  // Discovery handler
  const handleDiscover = useCallback((creatureId: string) => {
    setDiscoveries(prev => {
      if (prev.includes(creatureId)) return prev;
      if (soundEnabled) playDiscoverySound();
      return [...prev, creatureId];
    });
  }, [soundEnabled]);

  // Calculate darkness based on depth
  const darkness = useMemo(() => Math.min(0.85, depth / 11000 * 1.1), [depth]);

  // Light effect opacity
  const lightRadius = isLightOn ? 350 : 0;

  return (
    <div
      ref={scrollContainerRef}
      className="relative min-h-screen bg-[#050A0E]"
      style={{ cursor: 'none' }}
    >
      {/* Custom cursor */}
      <div
        className="ocean-cursor"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <div
        className={`ocean-cursor-light ${isLightOn ? 'active' : ''}`}
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Particle system */}
      <ParticleCanvas depth={depth} isLightOn={isLightOn} />

      {/* Darkness overlay */}
      <div className="darkness-overlay" style={{ opacity: darkness }} />

      {/* Submarine light effect */}
      {isLightOn && (
        <div
          className="fixed pointer-events-none z-[3] rounded-full transition-opacity duration-500"
          style={{
            left: mousePos.x - lightRadius / 2,
            top: mousePos.y - lightRadius / 2,
            width: lightRadius,
            height: lightRadius,
            background: `radial-gradient(circle, rgba(0,255,209,${0.08 * (1 - darkness * 0.5)}) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* HUD */}
      {hasStarted && (
        <HUD
          depth={depth}
          isLightOn={isLightOn}
          setIsLightOn={setIsLightOn}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          discoveries={discoveries}
          setShowDiscoveryLog={setShowDiscoveryLog}
          stopAmbient={() => stopAmbientRef.current?.()}
        />
      )}

      {/* Discovery Log Panel */}
      {showDiscoveryLog && (
        <DiscoveryLogPanel
          discoveries={discoveries}
          onClose={() => setShowDiscoveryLog(false)}
          allCreatures={CREATURES}
        />
      )}

      {/* HERO SECTION */}
      <HeroSection onStartDive={() => {
        setHasStarted(true);
        setTimeout(() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }, 300);
      }} />

      {/* DEPTH ZONES */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        {DEPTH_ZONES.map(zone => (
          <DepthZoneSection
            key={zone.id}
            zone={zone}
            onDiscover={handleDiscover}
            discoveries={discoveries}
            soundEnabled={soundEnabled}
          />
        ))}

        {/* PRESSURE LAB */}
        <PressureLabSection soundEnabled={soundEnabled} />

        {/* EXPEDITION TIMELINE */}
        <ExpeditionTimeline soundEnabled={soundEnabled} />

        {/* THREAT MAP */}
        <ThreatMapSection />

        {/* ACOUSTIC MAPPING */}
        <AcousticMappingSection soundEnabled={soundEnabled} />

        {/* FOOTER */}
        <footer className="relative py-16 px-4 text-center" style={{ background: '#000' }}>
          <div className="max-w-2xl mx-auto">
            <div className="sonar-ring mx-auto mb-6" style={{ position: 'relative' }} />
            <h3 className="font-['Orbitron'] text-lg font-bold text-[#00FFD1] mb-2" style={{ textShadow: '0 0 30px rgba(0,255,209,0.3)' }}>
              DEEP OCEAN INTELLIGENCE ARCHIVE
            </h3>
            <p className="font-['Space_Mono'] text-[11px] text-[rgba(255,255,255,0.3)] leading-relaxed mb-4">
              The ocean is the largest unexplored frontier on our planet. We have mapped more of the Moon&apos;s surface than our own ocean floor. Every dive reveals something new — a species, a landscape, a secret held for millions of years in crushing darkness.
            </p>
            <p className="font-['Space_Mono'] text-[10px] text-[rgba(255,255,255,0.2)] mb-6">
              The deep does not care about us. That is what makes it beautiful — and worth protecting.
            </p>
            <div className="flex justify-center gap-6 font-['Space_Mono'] text-[9px] text-[rgba(0,255,209,0.3)]">
              <span>{CREATURES.length} SPECIES</span>
              <span>•</span>
              <span>5 DEPTH ZONES</span>
              <span>•</span>
              <span>{discoveries.length}/{CREATURES.length} DISCOVERED</span>
            </div>
            <div className="mt-6 font-['Space_Mono'] text-[9px] text-[rgba(255,255,255,0.15)]">
              DIVE COMPLETE — RETURN TO SURFACE ↑
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
