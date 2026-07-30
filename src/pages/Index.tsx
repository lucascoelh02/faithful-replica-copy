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
      "https://scripts.converteai.net/2d21432a-6713-4192-8613-1bf4c67b1af6/players/6a443d7046cd7a90d1058c1e/v4/player.js";
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-stage">
      {/* Expert photo background + overlays */}
      <div className="expert-bg" aria-hidden="true" />
      <div className="stage-overlay" aria-hidden="true" />
      <div className="stage-noise" aria-hidden="true" />
      <div className="gold-dots" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>

      {/* Fixed urgency bar */}
      <div className="urgency-bar" role="status" aria-live="polite">
        <div className="urgency-inner">
          <svg
            className="urgency-clock"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span className="urgency-text">Tu compra está siendo procesada</span>
          <span className="urgency-dots" aria-hidden="true">
            <i /><i /><i />
          </span>
        </div>
      </div>

      {/* Spacer for the fixed bar */}
      <div className="h-12" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex w-full max-w-[520px] flex-col items-center px-5 pb-16 pt-8">
        <h1 className="headline">
          Mira la clase de bienvenida y reclama tu{" "}
          <span className="gold-text">regalo especial</span>.
        </h1>

        {/* VTurb Video Player */}
        <div ref={vturbContainerRef} className="player-frame mt-7">
          <div className="player-inner">
            <vturb-smartplayer
              id="vid-6a443d7046cd7a90d1058c1e"
              aria-label="Clase de bienvenida en video"
              style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "400px" }}
            >
              <div
                className="vturb-player-placeholder"
                style={{
                  position: "relative",
                  width: "100%",
                  padding: "178.05555555555554% 0 0",
                  zIndex: 0,
                  backgroundColor: "black",
                }}
              />
            </vturb-smartplayer>
          </div>
        </div>

        {/* Hotmart Sales Funnel Widget (CTA area) */}
        <div className={`cta-area mt-7 w-full ${showWidget ? "block" : "hidden"}`}>
          <div id="hotmart-sales-funnel" />
        </div>

        {/* Security signal */}
        <div className="secure-box mt-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3l7 3v5.5c0 4.3-2.9 8.1-7 9.5-4.1-1.4-7-5.2-7-9.5V6l7-3z" />
            <path d="M9.5 12.2l1.9 1.9 3.4-3.6" />
          </svg>
          <span>Compra 100% segura · Procesamiento cifrado</span>
        </div>
      </main>
    </div>
  );
};

export default Index;
