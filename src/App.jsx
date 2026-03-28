import StarBackground from "./components/StarBackground";
import Header from "./components/Header";
import Section from "./components/Section";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import AppContent from "./AppContent";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <StarBackground />
        <Header />
        <AppContent />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
