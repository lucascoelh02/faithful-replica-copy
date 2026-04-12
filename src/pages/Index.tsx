import { useState, useEffect, useRef } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vturb-smartplayer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { id?: string },
        HTMLElement
      >;
    }
  }
}

const CTA_THRESHOLD = 390; // 6:30 in seconds

const Index = () => {
  const [showCTA, setShowCTA] = useState(false);
  const vturbContainerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<number | null>(null);

  // Load VTurb script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://scripts.converteai.net/fd1282db-d399-4448-9f38-cb19b9659089/players/69daed2bccd7dd53185db12a/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // Poll VTurb player for playback time
  useEffect(() => {
    if (showCTA) return;

    const poll = () => {
      try {
        const video = vturbContainerRef.current?.querySelector("video");
        if (video && !video.paused && !video.ended && video.currentTime >= CTA_THRESHOLD) {
          setShowCTA(true);
          return;
        }
      } catch (_) {
        // player not ready yet
      }
      pollingRef.current = window.requestAnimationFrame(poll);
    };

    pollingRef.current = window.requestAnimationFrame(poll);

    return () => {
      if (pollingRef.current) cancelAnimationFrame(pollingRef.current);
    };
  }, [showCTA]);

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

      {/* VTurb Video Player */}
      <div
        ref={vturbContainerRef}
        className="mt-8 video-wrapper-upsell relative flex items-center justify-center"
      >
        <vturb-smartplayer
          id="vid-69daed2bccd7dd53185db12a"
          style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "400px" }}
        />
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
