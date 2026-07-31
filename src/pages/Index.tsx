import { useEffect, useRef } from "react";

const EXPERT_BG_URL = "/images/background-upsell.png";

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

  // Load VTurb script
  useEffect(() => {
    const script = document.createElement("script");
    const SRC =
      "https://scripts.converteai.net/a63caa10-e974-4189-be32-9f2c7cd675f5/players/6a6b2e4240f9e76dea05afb1/v4/player.js";
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
      {/* Expert photo background */}
      <div
        className="expert-bg"
        aria-hidden="true"
        style={{ ["--expert-photo" as string]: `url("${EXPERT_BG_URL}")` }}
      />
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
              id="vid-6a6b2e4240f9e76dea05afb1"
              aria-label="Clase de bienvenida en video"
              style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "400px" }}
            >
              <div
                className="vturb-player-placeholder"
                style={{
                  position: "relative",
                  width: "100%",
                  padding: "178.14814814814815% 0 0",
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
          <div className="hotmart-widget-viewport">
            <div id="hotmart-sales-funnel" />
            <span className="hotmart-widget-mask hotmart-widget-mask--legal" aria-hidden="true" />
            <span className="hotmart-widget-mask hotmart-widget-mask--bottom" aria-hidden="true" />
            <span className="hotmart-widget-mask hotmart-widget-mask--scrollbar" aria-hidden="true" />
          </div>
        </section>
      </main>

    </div>
  );
};

export default Index;
