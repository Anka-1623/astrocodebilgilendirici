import { useState } from "react";
import { references } from "../data/content";
import "./Footer.css";

export default function Footer() {
  const [showRefs, setShowRefs] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__logo">✦ astroCODE</span>
            <p className="footer__tagline">Türkiye Uzay Ajansı Bilgi Sitesi</p>
          </div>

          <div className="footer__links">
            <button
              className="footer__refs-btn"
              onClick={() => setShowRefs(!showRefs)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Kaynakça
            </button>
          </div>

          <p className="footer__copy">
            © 2026 astroCODE. Tüm bilgiler TUA resmi kaynaklarından derlenmiştir.
          </p>
        </div>
      </footer>

      {showRefs && (
        <div className="refs-overlay" onClick={() => setShowRefs(false)}>
          <div className="refs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="refs-modal__header">
              <h3>Kaynakça</h3>
              <button
                className="refs-modal__close"
                onClick={() => setShowRefs(false)}
              >
                ✕
              </button>
            </div>
            <ul className="refs-modal__list">
              {references.map((ref, i) => (
                <li key={i} className="refs-modal__item">
                  <span className="refs-modal__index">[{i + 1}]</span>
                  <div>
                    <p className="refs-modal__title">{ref.title}</p>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="refs-modal__url"
                    >
                      {ref.url}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
