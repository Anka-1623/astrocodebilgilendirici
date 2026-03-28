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
