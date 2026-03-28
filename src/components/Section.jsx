import { useEffect, useRef, useState } from "react";
import "./Section.css";

export default function Section({ id, title, items }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`section ${visible ? "section--visible" : ""}`}
    >
      <h2 className="section__title">{title}</h2>
      <div className="section__items">
        {items.map((item, i) => (
          <div
            key={i}
            className="section__card"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <h3 className="section__subtitle">{item.subtitle}</h3>
            {item.text && <p className="section__text">{item.text}</p>}
            {item.bullets && (
              <ul className="section__bullets">
                {item.bullets.map((b, j) => (
                  <li key={j} className="section__bullet">
                    <span className="section__bullet-icon">◆</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
