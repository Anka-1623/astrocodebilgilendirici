import { useState, useEffect } from "react";
import { sections } from "../data/content";
import "./Header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const offsets = sections.map((s) => {
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
  }, []);

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
          {sections.map((s) => (
            <button
              key={s.id}
              className={`header__link ${activeSection === s.id ? "header__link--active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.title.split("(")[0].trim()}
            </button>
          ))}
        </nav>

        <button
          className={`header__burger ${menuOpen ? "header__burger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
