import Section from "./components/Section";
import { sections, ui } from "./data/content";
import { useLanguage } from "./context/LanguageContext";

export default function AppContent() {
  const { lang } = useLanguage();
  const currentSections = sections[lang];
  const t = ui[lang];

  return (
    <main className="main">
      <div className="hero">
        <div className="hero__badge">{t.heroBadge}</div>
        <h1 className="hero__title">
          {t.heroTitle1}<br />
          <span className="hero__highlight">{t.heroTitle2}</span>
        </h1>
        <p className="hero__desc">{t.heroDesc}</p>
        <a
          href="https://astrocode-nine.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hero__btn"
        >
          {t.heroButton}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
        <div className="hero__scroll">
          <span>{t.heroScroll}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {currentSections.map((section) => (
        <Section key={section.id} {...section} />
      ))}
    </main>
  );
}
