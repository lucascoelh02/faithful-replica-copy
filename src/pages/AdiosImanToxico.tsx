import "@/styles/adios-iman-toxico.css";

const pillars = [
  {
    n: "01",
    title: "Diagnóstico del patrón",
    desc: "Descubre qué tipo de hombre tu inconsciente está programado para buscar y por qué a veces sientes química precisamente con quien puede hacerte daño.",
  },
  {
    n: "02",
    title: "Ruptura del patrón",
    desc: "Aprende a empezar a desactivar la atracción automática por perfiles que te lastiman.",
  },
  {
    n: "03",
    title: "Filtro de pretendientes",
    desc: "Identifica desde los primeros encuentros si un hombre es un candidato real o una pérdida de tiempo disfrazada.",
  },
  {
    n: "04",
    title: "La postura de ser encontrada",
    desc: "Posiciónate para que los hombres correctos puedan verte, buscarte y acercarse sin que tengas que correr detrás de nadie.",
  },
];

const materials = [
  "Identificar en menos de cinco minutos si un hombre tiene potencial real.",
  "Desactivar la atracción automática por hombres tóxicos.",
  "Sentir química genuina por hombres buenos, amables y disponibles.",
  "Salir de la posición de quien corre detrás.",
  "Evitar volver al mismo tipo de relación dolorosa.",
];

const CheckIcon = () => (
  <svg className="ait-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const AdiosImanToxico = () => {
  return (
    <div className="ait-page">
      <div className="ait-glow" aria-hidden="true" />

      <div className="ait-shell">
        <header className="ait-fade">
          <p className="ait-notice">
            <i aria-hidden="true" />
            Tu compra de Elegida para Siempre se está procesando.
          </p>

          <h1 className="ait-h1">
            No basta con ser elegida. También necesitas aprender a{" "}
            <span className="ait-gold">elegir al hombre correcto.</span>
          </h1>

          <p className="ait-sub">
            Adiós al Imán Tóxico te ayuda a dejar de sentirte atraída por los hombres que siempre
            terminan haciéndote daño.
          </p>
        </header>

        <section className="ait-section ait-fade">
          <p className="ait-bridge">
            Mientras Elegida para Siempre te enseña a ser elegida por el hombre que quieres, Adiós al
            Imán Tóxico te ayuda a reconocer si ese hombre realmente es una buena elección para tu
            vida.
          </p>
        </section>

        <section className="ait-section ait-fade">
          <h2 className="ait-h2">Los 4 pilares de Adiós al Imán Tóxico</h2>
          <div className="ait-grid">
            {pillars.map((p) => (
              <article key={p.n}>
                <p className="ait-pillar-n">{p.n}</p>
                <h3 className="ait-pillar-t">{p.title}</h3>
                <p className="ait-pillar-d">{p.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ait-section ait-fade">
          <h2 className="ait-h2">Además, tendrás acceso a materiales especiales para:</h2>
          <ul className="ait-list">
            {materials.map((m) => (
              <li key={m}>
                <CheckIcon />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ait-section ait-fade">
          <p className="ait-bridge">
            Dentro de este flujo posterior a tu compra de Elegida para Siempre, puedes acceder a
            Adiós al Imán Tóxico por una condición especial.
          </p>

          <div className="ait-offer">
            <p className="ait-old">Precio anterior: US$ 14,90</p>
            <p className="ait-now-label">Hoy en este flujo</p>
            <p className="ait-price">US$ 9,90</p>
          </div>

          <p className="ait-guarantee">Tu decisión está protegida por una garantía de 7 días.</p>
        </section>

        <footer className="ait-footer">
          <p>Rafael Montoya</p>
          <p>Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdiosImanToxico;
