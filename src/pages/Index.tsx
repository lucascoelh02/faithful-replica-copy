import { useEffect, useRef, useState } from "react";

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

const Index = () => {
  const vturbContainerRef = useRef<HTMLDivElement>(null);
  const [showWidget, setShowWidget] = useState(false);

  // Delayed display for Hotmart widget
  useEffect(() => {
    const timer = setTimeout(() => setShowWidget(true), 510000);
    return () => clearTimeout(timer);
  }, []);

  // Load VTurb script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://scripts.converteai.net/f025e9be-2815-40bc-b5b8-eee93ab897e7/players/6a32c50264ae5a734069d5a2/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // HOTMART - Sales Funnel Widget
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    script.onload = () => {
      // @ts-expect-error - checkoutElements is injected globally by Hotmart
      checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

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
          id="vid-6a32c50264ae5a734069d5a2"
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


      {/* Hotmart Sales Funnel Widget */}
      <div className={`mt-6 w-full max-w-2xl ${showWidget ? "block" : "hidden"}`}>
        <div id="hotmart-sales-funnel" />
      </div>

      {/* Spacer */}
      <div className="h-12" />
    </div>
  );
};

export default Index;
