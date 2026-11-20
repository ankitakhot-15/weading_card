import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CalendarPlus,
  Check,
  DoorClosed,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ArchCornerFiligree, KalashCrest, LotusDivider } from './MarathiOrnament';
import { ReelCanvasBackdrop } from './ReelCanvasBackdrop';
import {
  downloadWeddingCalendarICS,
  playAuspiciousChime,
  startAmbientDrone,
  stopAmbientDrone,
} from '../utils/auspiciousAudio';

interface WeddingContentProps {
  doorOpen: boolean;
  onReplayDoor: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

const royalEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const INVITE_SHARE_TEXT = `💍 शुभविवाह सोहळा – सोहम ❤️ पूनम

॥ श्री गणेशाय नमः ॥
🌺 श्री गणेशाच्या कृपेने 🌺
आमच्या येथे श्री गणेशाच्या आशीर्वादाने चि. सोहम आणि चि. सौ. कां. पूनम यांचा शुभविवाह सोहळा आयोजित केला आहे.

दिनांक: मंगळवार, १ डिसेंबर २०२६
स्थळ: यशवंत मल्टिपर्पज हॉल, गडमुडशिंगी, कोल्हापूर.

सस्नेह निमंत्रक: समस्त परिवार`;

const VIDEO_FRAMES = [
  {
    src: '/src/assets/images/royal_groom_soham_1795154118217.jpg',
    alt: 'पारंपारिक पेशवाई वेशभूषेतील चि. सोहम चालत येऊन नमस्कार स्वागत',
    title: 'चि. सोहम',
    subtitle: 'वर आगमन · चालत स्वागत',
    namasteSubtitle: 'सप्रेम नमस्कार · सुस्वागतम्',
    objectPos: 'object-[50%_18%]',
    durationMs: 4200,
    swaySign: 1,
  },
  {
    src: '/src/assets/images/royal_bride_poonam_1795154117684.jpg',
    alt: 'पारंपारिक पैठणी नऊवारी मधील चि. सौ. कां. पूनम चालत येऊन नमस्कार स्वागत',
    title: 'चि. सौ. कां. पूनम',
    subtitle: 'वधू आगमन · चालत स्वागत',
    namasteSubtitle: 'सप्रेम नमस्कार · सुस्वागतम्',
    objectPos: 'object-[50%_18%]',
    durationMs: 4200,
    swaySign: -1,
  },
  {
    src: '/src/assets/images/royal_couple_welcome_mandap_1795154118127.jpg',
    alt: 'वर चि. सोहम आणि वधू चि. सौ. कां. पूनम एकत्रित शुभस्वागत',
    title: 'सोहम ❤️ पूनम',
    subtitle: 'शुभविवाह स्वागत',
    namasteSubtitle: 'सुस्वागतम् · आपल्या आगमनाची प्रतीक्षा',
    objectPos: 'object-[50%_22%]',
    durationMs: 5200,
    swaySign: 1,
  },
] as const;

/**
 * Foreground 3D bokeh & rose/marigold petal overlay rendered directly inside the video frame
 * for realistic camera depth while the Groom & Bride walk forward and bow in Namaste.
 */
const VideoForegroundOverlay: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!active || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs = Array.from({ length: 18 }, () => ({
      x: Math.random() * (canvas.width || 400),
      y: Math.random() * (canvas.height || 440),
      r: 2 + Math.random() * 5,
      vy: -(0.3 + Math.random() * 0.65),
      vx: (Math.random() - 0.5) * 0.3,
      alpha: 0.2 + Math.random() * 0.45,
      isPetal: Math.random() > 0.55,
      rot: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const o of orbs) {
        if (o.isPetal) {
          o.y += Math.abs(o.vy) * 1.45;
          o.x += Math.sin(o.y * 0.03) * 0.6;
          o.rot += 0.03;
          if (o.y > canvas.height + 12) {
            o.y = -12;
            o.x = Math.random() * canvas.width;
          }
          ctx.save();
          ctx.translate(o.x, o.y);
          ctx.rotate(o.rot);
          ctx.globalAlpha = o.alpha * 0.85;
          ctx.fillStyle = o.r > 4.2 ? '#F59E0B' : '#C81E3A';
          ctx.beginPath();
          ctx.ellipse(0, 0, o.r * 1.2, o.r * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          o.y += o.vy;
          o.x += o.vx;
          if (o.y < -12) {
            o.y = canvas.height + 12;
            o.x = Math.random() * canvas.width;
          }
          ctx.save();
          ctx.globalAlpha = o.alpha;
          ctx.fillStyle = '#FDE68A';
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
};

/**
 * Looping AI-Video-Style Animated Couple Welcome Showcase
 * Plays immediately upon door opening:
 * Groom Walks -> Namaste Bow -> Bride Walks -> Namaste Bow -> Couple Walks -> Grand Namaste Welcome.
 */
const AiCoupleVideoStage: React.FC<{ active: boolean }> = ({ active }) => {
  const [frameIdx, setFrameIdx] = useState(0);
  const [phase, setPhase] = useState<'walk' | 'namaste'>('walk');
  const [isPlaying, setIsPlaying] = useState(true);
  const [cycleNonce, setCycleNonce] = useState(0);

  // Continuous Reel Loop across Groom -> Bride -> Couple
  useEffect(() => {
    if (!active || !isPlaying) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setFrameIdx(2);
      setPhase('namaste');
      return;
    }

    const duration = VIDEO_FRAMES[frameIdx].durationMs;
    const nextTimer = window.setTimeout(() => {
      setFrameIdx((prev) => (prev + 1) % VIDEO_FRAMES.length);
    }, duration);

    return () => window.clearTimeout(nextTimer);
  }, [active, isPlaying, frameIdx, cycleNonce]);

  // Inside each frame: 0.0s -> 2.0s Walking Forward, 2.0s -> end Namaste Bow Reaction
  useEffect(() => {
    if (!active) {
      setPhase('walk');
      return;
    }
    setPhase('walk');
    const bowTimer = window.setTimeout(() => {
      setPhase('namaste');
    }, 2000);
    return () => window.clearTimeout(bowTimer);
  }, [active, frameIdx, cycleNonce]);

  const currentFrame = VIDEO_FRAMES[frameIdx];
  const s = currentFrame.swaySign;

  const handleRestartVideo = () => {
    setFrameIdx(0);
    setPhase('walk');
    setIsPlaying(true);
    setCycleNonce((n) => n + 1);
  };

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div
        className="relative h-[400px] sm:h-[470px] w-full overflow-hidden rounded-t-[210px] rounded-b-2xl border-2 border-[#E3B867]/80 bg-[#1B0308] shadow-[0_26px_70px_rgba(0,0,0,0.75)]"
        style={{ perspective: '950px' }}
      >
        {/* Top Golden Reel Progress Strip */}
        <div className="absolute top-3 inset-x-12 z-20 grid grid-cols-3 gap-1.5 pointer-events-none">
          {VIDEO_FRAMES.map((f, idx) => (
            <div key={f.subtitle} className="h-0.5 overflow-hidden rounded-full bg-white/25">
              {idx < frameIdx ? (
                <div className="h-full w-full bg-[#F2D184]" />
              ) : idx === frameIdx && isPlaying ? (
                <motion.div
                  key={`bar-${idx}-${cycleNonce}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: f.durationMs / 1000, ease: 'linear' }}
                  className="h-full w-full origin-left bg-[#F2D184]"
                />
              ) : (
                <div className={`h-full ${idx === frameIdx ? 'w-full bg-[#F2D184]' : 'w-0'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Animated Groom / Bride / Couple AI Video Frame */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`ai-frame-${frameIdx}-${cycleNonce}`}
            initial={{ opacity: 0, scale: 0.72, y: 36, filter: 'blur(1.5px)' }}
            animate={
              phase === 'walk'
                ? {
                    // Distinct Walking Forward Stride toward viewer
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: [0.72, 0.8, 0.88, 0.96, 1.04],
                    y: [36, 23, 28, 15, 20, 7, 11, 0],
                    rotateZ: [0, -1.6 * s, 1.4 * s, -1.3 * s, 1.1 * s, 0],
                    rotateX: 0,
                  }
                : {
                    // Pause + Unmistakable 3D Waist-Pivot Namaste Greeting Bow
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: [1.04, 1.09, 1.05],
                    y: [0, 10, 0],
                    rotateZ: 0,
                    rotateX: [0, 12, 2],
                  }
            }
            exit={{ opacity: 0, scale: 1.08 }}
            transition={
              phase === 'walk'
                ? {
                    opacity: { duration: 0.55, ease: royalEase },
                    filter: { duration: 0.8 },
                    scale: { duration: 2.0, ease: [0.22, 0.85, 0.35, 1] },
                    y: { duration: 2.0, ease: 'easeInOut' },
                    rotateZ: { duration: 2.0, ease: 'easeInOut' },
                  }
                : {
                    scale: { duration: 1.45, ease: royalEase },
                    y: { duration: 1.45, ease: royalEase },
                    rotateX: { duration: 1.45, ease: royalEase },
                  }
            }
            style={{ transformOrigin: '50% 72%', transformStyle: 'preserve-3d' }}
            className="absolute inset-0"
          >
            <img
              src={currentFrame.src}
              alt={currentFrame.alt}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover ${currentFrame.objectPos} select-none`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Golden Namaste Light Sweep & Shimmer */}
        <motion.div
          aria-hidden="true"
          animate={
            phase === 'namaste'
              ? { opacity: [0, 0.65, 0.2], scale: [0.82, 1.18, 1.06] }
              : { opacity: 0, scale: 0.82 }
          }
          transition={{ duration: 1.3, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(253, 230, 138, 0.48) 0%, rgba(212, 162, 76, 0.16) 42%, rgba(25, 3, 7, 0) 72%)',
          }}
        />

        {/* Foreground Live Bokeh & Rose Petals */}
        <VideoForegroundOverlay active={active} />

        {/* Contrast Scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-t from-[#190307]/95 via-[#190307]/15 to-[#190307]/30 pointer-events-none"
        />

        {/* Compact Top-Right Play/Pause & Restart Controls inside Video Frame */}
        <div className="absolute top-6 right-5 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'थांबवा' : 'चलावा'}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F2D184]/60 bg-[#23060A]/75 backdrop-blur-sm text-[#F7DC9C] transition-colors hover:bg-[#3B0B13] cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRestartVideo}
            aria-label="वर-वधू व्हिडिओ पुन्हा पहा"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F2D184]/60 bg-[#23060A]/75 backdrop-blur-sm text-[#F7DC9C] transition-colors hover:bg-[#3B0B13] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Bottom Live Caption & Interactive Dots */}
        <div className="absolute inset-x-0 bottom-4 z-20 px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${frameIdx}-${phase}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[11px] sm:text-xs tracking-widest text-[#F2D184]">
                {phase === 'namaste' ? currentFrame.namasteSubtitle : currentFrame.subtitle}
              </p>
              <p className="mt-0.5 font-display-mr text-2xl sm:text-3xl gold-foil-text drop-shadow">
                {currentFrame.title}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-3 flex items-center justify-center gap-2">
            {VIDEO_FRAMES.map((frame, idx) => (
              <button
                key={frame.subtitle}
                type="button"
                onClick={() => {
                  setFrameIdx(idx);
                  setCycleNonce((n) => n + 1);
                }}
                aria-label={frame.subtitle}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === frameIdx ? 'w-7 bg-[#F2D184]' : 'w-2 bg-[#F2D184]/40 hover:bg-[#F2D184]/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WeddingContent: React.FC<WeddingContentProps> = ({
  doorOpen,
  onReplayDoor,
  audioEnabled,
  onToggleAudio,
}) => {
  const [shareStatus, setShareStatus] = useState('');
  const [calendarSaved, setCalendarSaved] = useState(false);

  useEffect(() => {
    if (audioEnabled) {
      startAmbientDrone();
    } else {
      stopAmbientDrone();
    }
    return () => {
      stopAmbientDrone();
    };
  }, [audioEnabled]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'शुभविवाह सोहळा – सोहम ❤️ पूनम',
          text: INVITE_SHARE_TEXT,
          url: window.location.href,
        });
        setShareStatus('शेअर केले');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${INVITE_SHARE_TEXT}\n\n${window.location.href}`);
        setShareStatus('कॉपी झाले');
      }
    } catch {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${INVITE_SHARE_TEXT}\n\n${window.location.href}`);
          setShareStatus('कॉपी झाले');
        }
      } catch {
        setShareStatus('तयार');
      }
    }
    window.setTimeout(() => setShareStatus(''), 2800);
  };

  const handleCalendarDownload = () => {
    downloadWeddingCalendarICS();
    playAuspiciousChime();
    setCalendarSaved(true);
    window.setTimeout(() => setCalendarSaved(false), 3000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#190307] text-[#FDF7EC] overflow-x-clip">
      {/* Ambient Animated Royal Backdrop behind the Invitation Card */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ReelCanvasBackdrop
          active={doorOpen}
          celebrationBurstKey={doorOpen ? 1 : 0}
          sparklerActive={doorOpen}
        />
      </div>

      {/* Discreet Top-Right Floating Controls (Audio + Replay Door) */}
      {doorOpen && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAudio}
            aria-label={audioEnabled ? 'मंगल स्वर बंद करा' : 'मंगल स्वर चालू करा'}
            aria-pressed={audioEnabled}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3B867]/50 bg-[#2A080E]/80 backdrop-blur-md text-[#F2D184] shadow-lg transition-colors hover:bg-[#3F0D16] cursor-pointer"
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onReplayDoor}
            aria-label="प्रवेशद्वार पुन्हा पहा"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3B867]/50 bg-[#2A080E]/80 backdrop-blur-md text-[#F2D184] shadow-lg transition-colors hover:bg-[#3F0D16] cursor-pointer"
          >
            <DoorClosed className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* PURE ROYAL DIGITAL INVITATION CARD FLOW */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0.82 }}
        animate={doorOpen ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0.82 }}
        transition={{ duration: 1.35, ease: royalEase }}
        className="relative z-10 mx-auto max-w-2xl px-3 sm:px-6 py-5 sm:py-9"
      >
        <div className="relative overflow-hidden rounded-t-[180px] sm:rounded-t-[240px] rounded-b-3xl border border-[#D4A24C]/65 bg-[#2A060D]/92 backdrop-blur-md shadow-[0_28px_80px_rgba(0,0,0,0.7)]">
          <div className="paithani-border-strip" aria-hidden="true" />

          {/* PAGE 1: IMMEDIATE OPENING REEL — SHRI GANESH + WALK-THEN-NAMASTE COUPLE VIDEO */}
          <div className="relative">
            <div className="relative h-36 sm:h-44 w-full overflow-hidden">
              <img
                src="/src/assets/images/toran_marigold_arch_1795152702118.jpg"
                alt="झेंडू व आंब्याच्या पानांचे तोरण"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center opacity-85"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#2A060D]/30 via-[#2A060D]/45 to-[#2A060D]"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={doorOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.85, delay: 0.15, ease: royalEase }}
              className="relative -mt-10 px-5 pb-10 sm:px-10 text-center"
            >
              <p className="text-sm sm:text-base font-semibold tracking-widest text-[#F2D184]">
                ॥ श्री गणेशाय नमः ॥
              </p>

              <h1 className="mt-2 font-display-mr text-2xl sm:text-4xl gold-foil-text tracking-wide text-balance">
                💍 शुभविवाह सोहळा – सोहम ❤️ पूनम
              </h1>

              {/* AI-Video Bride & Groom Walk -> Namaste Immediately Visible Upon Door Opening */}
              <div className="mt-5">
                <AiCoupleVideoStage active={doorOpen} />
              </div>

              <div className="mt-7 space-y-2">
                <motion.h2
                  initial={{ opacity: 0, x: -35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.0, ease: royalEase }}
                  className="font-display-mr text-4xl sm:text-5xl gold-foil-text"
                >
                  चि. सोहम
                </motion.h2>

                <p className="text-base sm:text-lg text-[#EBD4A7]">आणि</p>

                <motion.h2
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.0, ease: royalEase }}
                  className="font-display-mr text-4xl sm:text-5xl gold-foil-text"
                >
                  चि. सौ. कां. पूनम
                </motion.h2>
              </div>

              <p className="mt-5 text-lg sm:text-xl font-semibold text-[#FDF7EC]">
                यांचा शुभविवाह सोहळा आयोजित केला आहे.
              </p>

              <LotusDivider />

              <p className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-[#EBD4A7]">
                या मंगलमय प्रसंगी आपण सहकुटुंब, सहपरिवार उपस्थित राहून वधू-वरांना शुभाशीर्वाद द्यावेत, ही नम्र विनंती.
              </p>
            </motion.div>
          </div>

          <div className="gold-divider mx-8" />

          {/* PAGE 2: SHRI GANESH VANDANA & SHLOKA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: royalEase }}
            className="relative px-6 py-10 sm:px-10 sm:py-12 text-center"
          >
            <ArchCornerFiligree className="absolute top-4 left-4 w-8 h-8" />
            <ArchCornerFiligree className="absolute top-4 right-4 w-8 h-8 rotate-90" />

            <div className="mx-auto h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-2 border-[#E3B867] shadow-[0_0_36px_rgba(227,184,103,0.45)] bg-[#3B0B13]">
              <img
                src="/src/assets/images/ganesh_royal_emblem_1795152701464.jpg"
                alt="॥ श्री गणेशाय नमः ॥"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="mt-6 space-y-1.5 text-[#FDF7EC]">
              <p className="text-base sm:text-lg font-semibold text-[#F7DC9C]">
                ॐ गं गणपतये नमः ॥
              </p>
              <p className="text-base sm:text-xl leading-relaxed">
                वक्रतुंड महाकाय सूर्यकोटी समप्रभ ।
              </p>
              <p className="text-base sm:text-xl leading-relaxed">
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>
            </div>

            <p className="mt-6 text-base sm:text-lg font-medium text-[#F2D184]">
              🌺 श्री गणेशाच्या कृपेने 🌺
            </p>
            <p className="mt-1.5 text-sm sm:text-base text-[#EBD4A7]">
              आमच्या येथे श्री गणेशाच्या आशीर्वादाने
            </p>
          </motion.div>

          <div className="gold-divider mx-8" />

          {/* PAGE 3: DATE, VENUE & ROYAL MANDAP */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: royalEase }}
            className="relative px-5 py-10 sm:px-10 sm:py-12 text-center"
          >
            <h3 className="font-display-mr text-2xl sm:text-3xl text-[#F7DC9C]">
              💐 शुभविवाह सोहळा 💐
            </h3>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3B867]/40 bg-[#1B0308]">
              <img
                src="/src/assets/images/mandap_kolhapur_venue_1795152702669.jpg"
                alt="यशवंत मल्टिपर्पज हॉल, गडमुडशिंगी, कोल्हापूर"
                referrerPolicy="no-referrer"
                className="h-48 sm:h-60 w-full object-cover object-center"
              />
            </div>

            <div className="mt-7 space-y-5 text-[#FDF7EC]">
              <div>
                <p className="text-xs sm:text-sm tracking-widest text-[#E3B867]">दिनांक</p>
                <p className="mt-1 text-xl sm:text-2xl font-semibold">
                  मंगळवार, १ डिसेंबर २०२६
                </p>
              </div>

              <div>
                <p className="text-xs sm:text-sm tracking-widest text-[#E3B867]">स्थळ</p>
                <p className="mt-1 text-lg sm:text-xl font-semibold leading-relaxed">
                  यशवंत मल्टिपर्पज हॉल,
                  <br />
                  गडमुडशिंगी, कोल्हापूर.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Yashwant+Multipurpose+Hall+Gadmudshingi+Kolhapur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#C9973E] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#23060A] transition-colors hover:bg-[#DAB05F] whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>नकाशा पहा</span>
              </a>

              <button
                type="button"
                onClick={handleCalendarDownload}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E3B867]/50 bg-[#3B0B13]/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-[#F7DC9C] transition-colors hover:bg-[#4F101B] whitespace-nowrap cursor-pointer"
              >
                {calendarSaved ? (
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <CalendarPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                <span>{calendarSaved ? 'कॅलेंडर जतन झाले' : 'कॅलेंडरमध्ये जतन करा'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E3B867]/50 bg-[#3B0B13]/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-[#F7DC9C] transition-colors hover:bg-[#4F101B] whitespace-nowrap cursor-pointer"
              >
                {shareStatus ? (
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                <span>{shareStatus || 'आमंत्रण शेअर करा'}</span>
              </button>
            </div>
          </motion.div>

          <div className="gold-divider mx-8" />

          {/* PAGE 4: SNEH-NIMANTRAK FINALE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: royalEase }}
            className="relative px-6 py-10 sm:px-10 sm:py-12 text-center"
          >
            <ArchCornerFiligree className="absolute bottom-4 left-4 w-8 h-8 -rotate-90" />
            <ArchCornerFiligree className="absolute bottom-4 right-4 w-8 h-8 rotate-180" />

            <div className="flex justify-center">
              <KalashCrest className="w-10 h-10 text-[#E3B867]" />
            </div>

            <p className="mt-4 text-base sm:text-lg font-medium text-[#FDF7EC]">
              आपली उपस्थिती आणि शुभाशीर्वाद हीच आमच्यासाठी अनमोल भेट!
            </p>

            <p className="mt-6 text-sm tracking-widest text-[#E3B867] font-semibold">
              सस्नेह निमंत्रक
            </p>
            <h3 className="mt-1.5 font-display-mr text-3xl sm:text-4xl gold-foil-text">
              समस्त परिवार
            </h3>
          </motion.div>

          <div className="paithani-border-strip" aria-hidden="true" />
        </div>
      </motion.div>
    </div>
  );
};
