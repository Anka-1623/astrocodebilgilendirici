import StarBackground from "./components/StarBackground";
import Header from "./components/Header";
import Section from "./components/Section";
import Footer from "./components/Footer";
import { sections } from "./data/content";
import "./App.css";

function App() {
  return (
    <div className="app">
      <StarBackground />
      <Header />

      <main className="main">
        <div className="hero">
          <div className="hero__badge">✦ astroCODE</div>
          <h1 className="hero__title">
            Türkiye Uzay<br />
            <span className="hero__highlight">Ajansı</span>
          </h1>
          <p className="hero__desc">
            Uzayın derinliklerine yolculuk. Türkiye'nin uzay vizyonu,
            hedefleri ve geleceğe dair planları.
          </p>
          <div className="hero__scroll">
            <span>Aşağı kaydır</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        {sections.map((section) => (
          <Section key={section.id} {...section} />
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default App;
