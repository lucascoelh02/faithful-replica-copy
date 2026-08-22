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

const SECONDS_TO_DISPLAY = 538;


const Index = () => {
  const vturbContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Animate progress 0% -> 70% quickly, then 70% -> 100% over ~600s
  useEffect(() => {
    const start = performance.now();
    const quickMs = 1500;
    const slowMs = 600000;
    const totalMs = quickMs + slowMs;
    const quickRatio = quickMs / totalMs;
    let raf = 0;

    const easeOutQuad = (p: number) => 1 - Math.pow(1 - p, 2);

    const tick = (now: number) => {
      const t = Math.min((now - start) / totalMs, 1);
      let value: number;
      if (t <= quickRatio) {
        const p = easeOutQuad(t / quickRatio);
        value = p * 70;
      } else {
        const p = easeOutQuad((t - quickRatio) / (1 - quickRatio));
        value = 70 + p * 30;
      }
      setProgress(Math.round(value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);



  // Load VTurb script
  useEffect(() => {
    const script = document.createElement("script");
    const SRC =
      "https://scripts.converteai.net/5c8a1932-3c2a-4445-8f46-4e8d7b9ddb08/players/6a897568352978437ed192d2/v4/player.js";
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    script.src = SRC;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // HOTMART - Sales Funnel Widget: load script once and mount once
  useEffect(() => {
    const SRC = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    const w = window as unknown as {
      checkoutElements?: any;
      __hotmartFunnelMounted?: boolean;
    };

    const mount = () => {
      if (w.__hotmartFunnelMounted) return;
      const el = document.querySelector("#hotmart-sales-funnel");
      if (!el || !w.checkoutElements) return;
      w.__hotmartFunnelMounted = true;
      w.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
    };

    let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    if (w.checkoutElements) {
      mount();
    } else {
      script.addEventListener("load", mount);
    }

    return () => {
      script?.removeEventListener("load", mount);
    };
  }, []);

  // Reveal widget based on real VTurb video progress
  useEffect(() => {
    let attempts = 0;
    let cleanup: (() => void) | undefined;

    const attach = () => {
      const el = document.querySelector<HTMLElement & {
        displayHiddenElements?: (s: number, sel: string[], o?: any) => void;
      }>("vturb-smartplayer");
      if (!el) return false;
      const onReady = function (this: any) {
        this.displayHiddenElements?.(SECONDS_TO_DISPLAY, ["#hotmart-funnel-delay"], {
          persist: true,
        });
      };
      el.addEventListener("player:ready", onReady);
      cleanup = () => el.removeEventListener("player:ready", onReady);
      return true;
    };

    if (!attach()) {
      const interval = window.setInterval(() => {
        attempts += 1;
        if (attach() || attempts > 120) window.clearInterval(interval);
      }, 500);
      return () => {
        window.clearInterval(interval);
        cleanup?.();
      };
    }

    return () => cleanup?.();
  }, []);



  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-stage">
      {/* Neutral premium gradient background */}
      <div className="stage-gradient" aria-hidden="true" />

      {/* Fixed urgency line */}
      <div className="urgency-bar" role="status" aria-live="polite">
        <div className="urgency-inner">
          <span className="urgency-text">
            ⚠️ NO CIERRES ESTA PÁGINA — tu acceso está siendo preparado
          </span>
        </div>
      </div>

      {/* Spacer for the fixed bar */}
      <div className="h-12" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex w-full max-w-[520px] flex-col items-center px-5 pb-16 pt-4">
        {/* Progress bar */}
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            <span className="progress-value">{progress}%</span>
          </div>
        </div>

        <h1 className="headline mt-5">
          Solo falta 1 paso para que accedas a tu método completo.
        </h1>

        <p className="subheadline mt-3">
          El desafío detiene las peleas. Aquí está lo que evita que los viejos patrones destruyan el cambio que acabas de comenzar.
        </p>

        <div className="social-proof mt-4">
          <span className="social-proof-icon" aria-hidden="true">⚠️</span>
          <span>El 87,3% de las alumnas de la guía dicen: ¡SÍ!</span>
        </div>


        {/* VTurb Video Player */}
        <div ref={vturbContainerRef} className="player-frame mt-7">
          <div className="player-inner">
            <vturb-smartplayer
              id="vid-6a7a70af784b30f21a6da776"
              aria-label="Clase de bienvenida en video"
              style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "400px" }}
            >
              <div
                className="vturb-player-placeholder"
                style={{
                  position: "relative",
                  width: "100%",
                  padding: "177.77777777777777% 0 0",
                  zIndex: 0,
                  backgroundColor: "black",
                }}
              />
            </vturb-smartplayer>
          </div>
        </div>


        {/* Hotmart Sales Funnel widget — revealed at 4:50 of real video progress */}
        <section
          id="hotmart-funnel-section"
          className="hotmart-funnel hotmart-funnel--gated"
          aria-hidden="true"
        >
          <div id="hotmart-sales-funnel"></div>
        </section>
      </main>

    </div>
  );
};

export default Index;
