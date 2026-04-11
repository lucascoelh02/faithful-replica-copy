import { useState, useRef, useEffect, useCallback } from "react";

const Index = () => {
  const [showCTA, setShowCTA] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedSecondsRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const CTA_THRESHOLD = 390; // 6 minutes 30 seconds

  const trackPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) {
      lastTimeRef.current = null;
      return;
    }

    const now = performance.now();
    if (lastTimeRef.current !== null) {
      const delta = (now - lastTimeRef.current) / 1000;
      if (delta > 0 && delta < 1) {
        playedSecondsRef.current += delta;
      }
    }
    lastTimeRef.current = now;

    if (playedSecondsRef.current >= CTA_THRESHOLD && !showCTA) {
      setShowCTA(true);
    }

    animFrameRef.current = requestAnimationFrame(trackPlayback);
  }, [showCTA]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(trackPlayback);
    };

    const onPause = () => {
      lastTimeRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onPause);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [trackPlayback]);

  return (
    <div className="upsell-gradient-bg min-h-screen flex flex-col items-center px-4 py-10 md:py-16">
      {/* Headline */}
      <h1 className="text-3xl md:text-5xl font-black text-foreground text-center tracking-tight">
        ¡FELICIDADES!
      </h1>

      {/* Subheadline */}
      <p className="mt-3 text-base md:text-lg text-foreground text-center max-w-2xl">
        Acabas de asegurar tu acceso y la{" "}
        <strong>clase inaugural</strong> ya está disponible:
      </p>

      {/* Divider */}
      <div className="divider-line my-6" />

      {/* Lesson title */}
      <h2 className="text-xl md:text-2xl font-bold text-foreground text-center max-w-2xl leading-snug">
        <span className="highlight-label italic underline font-extrabold">
          CLASE 01
        </span>{" "}
        – Cómo hacer que tu pareja reconozca sus errores y cambie de forma más rápida
      </h2>

      {/* Video placeholder */}
      <div className="mt-8 video-wrapper-upsell relative flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          controls
        >
          {/* Replace src with actual video URL */}
          <source src="" type="video/mp4" />
          Tu navegador no soporta el video.
        </video>

        {/* Play icon overlay when no src */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary-foreground ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-line my-6" />

      {/* Description text */}
      <p className="text-sm md:text-base font-semibold text-foreground text-center max-w-2xl">
        Durante esta clase inaugural vas a descubrir: mira el video a continuación:
      </p>

      {/* Checklist */}
      <ul className="mt-4 flex flex-col md:flex-row md:flex-wrap justify-center gap-2 md:gap-6 text-sm md:text-base text-foreground">
        <li className="flex items-center gap-2">
          <span>✅</span>
          <span>Los primeros pasos de la restauración</span>
        </li>
        <li className="flex items-center gap-2">
          <span>✅</span>
          <span>Cómo identificar dónde está tu relación ahora</span>
        </li>
        <li className="flex items-center gap-2">
          <span>✅</span>
          <span>La metodología completa que vamos a usar</span>
        </li>
      </ul>

      {/* CTA Section - hidden until 6:30 of video */}
      <div
        className={`mt-8 flex flex-col items-center gap-4 transition-all duration-700 ${
          showCTA
            ? "opacity-100 translate-y-0 fade-in-up"
            : "opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden"
        }`}
      >
        <a href="https://pay.hotmart.com/G105337427J?checkoutMode=10" className="cta-upsell pulse-glow" style={{ textDecoration: 'none' }}>
          Sí, quiero aprovechar esta oportunidad
        </a>
        <span className="decline-link">
          No, me gustaría rechazar esta oferta
        </span>
      </div>

      {/* Spacer */}
      <div className="h-12" />
    </div>
  );
};

export default Index;
