import { useState, useEffect } from "react";
import { sections, ui } from "../data/content";
import { useLanguage } from "../context/LanguageContext";
import "./Header.css";

export default function Header() {
  const { lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const currentSections = sections[lang];
  const t = ui[lang];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const offsets = currentSections.map((s) => {
        const el = document.getElementById(s.id);
        return el ? { id: s.id, top: el.offsetTop - 100 } : null;
      }).filter(Boolean);

      for (let i = offsets.length - 1; i >= 0; i--) {
        if (window.scrollY >= offsets[i].top) {
          setActiveSection(offsets[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentSections]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__inner">
        <div className="header__logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="header__logo-icon">✦</span>
          <span className="header__logo-text">astroCODE</span>
        </div>

        <nav className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}>
          {currentSections.map((s) => (
            <button
              key={s.id}
              className={`header__link ${activeSection === s.id ? "header__link--active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.navLabel}
            </button>
          ))}

          <button className="header__lang" onClick={toggleLang}>
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </nav>

        <div className="header__actions">
          <button className="header__lang header__lang--mobile" onClick={toggleLang}>
            {lang === "tr" ? "EN" : "TR"}
          </button>

          <button
            className={`header__burger ${menuOpen ? "header__burger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t.menuAria}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
