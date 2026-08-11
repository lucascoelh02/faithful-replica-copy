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

const SECONDS_TO_DISPLAY = 290;
const STORAGE_KEY = "alreadyElsDisplayed290";

const showHotmartFunnel = () => {
  const section = document.querySelector<HTMLElement>("#hotmart-funnel-section");
  if (!section) return;
  section.style.display = "block";
  section.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => section.classList.add("is-visible"));
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* ignore */
  }
};

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
      "https://scripts.converteai.net/8b094072-28cc-4b6c-89e6-7fdc278d36fa/players/6a7a70af784b30f21a6da776/v4/player.js";
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    script.src = SRC;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // Load Hotmart checkout elements script once and mount the widget once
  useEffect(() => {
    let mounted = false;

    const mount = () => {
      if (mounted) return;
      const el = document.querySelector("#hotmart-sales-funnel");
      const ce = (window as unknown as { checkoutElements?: any }).checkoutElements;
      if (!el || !ce || el.childElementCount > 0) return;
      mounted = true;
      ce.init("salesFunnel").mount("#hotmart-sales-funnel");
    };

    const SRC = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    if ((window as unknown as { checkoutElements?: unknown }).checkoutElements) {
      mount();
    } else {
      script.addEventListener("load", mount);
    }

    return () => {
      script?.removeEventListener("load", mount);
    };
  }, []);

  // Reveal widget based on real VTurb video progress (or previous unlock)
  useEffect(() => {
    let released = false;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") {
        released = true;
        showHotmartFunnel();
      }
    } catch {
      /* ignore */
    }
    if (released) return;

    let attempts = 0;
    const watch = () => {
      const sp = (window as unknown as { smartplayer?: any }).smartplayer;
      if (!sp || !sp.instances || !sp.instances.length) return false;
      const player = sp.instances[0];
      player.on("timeupdate", () => {
        if (player.video?.currentTime >= SECONDS_TO_DISPLAY) {
          showHotmartFunnel();
        }
      });
      return true;
    };

    if (watch()) return;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (watch() || attempts > 120) window.clearInterval(interval);
    }, 500);

    return () => window.clearInterval(interval);
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
          Solo falta 1 paso para que accedas a tu guía.
        </h1>

        <p className="subheadline mt-3">
          Tus frases despiertan la obsesión. Aquí está lo que transforma la obsesión en una{" "}
          <strong>PROPUESTA DE NOVIAZGO</strong>.
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

        {/* Hotmart Sales Funnel widget — revealed at 4:50 of real video progress */}
        <section
          id="hotmart-funnel-section"
          className="hotmart-funnel hotmart-funnel--gated"
          aria-hidden="true"
        >
          <div id="hotmart-sales-funnel" />
        </section>
      </main>

    </div>
  );
};

export default Index;
