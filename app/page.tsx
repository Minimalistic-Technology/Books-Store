import Footer from "./components/footer/page";
import Header from "./components/header/page";
import HeroSection from "./components/herosection/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
    
      <HeroSection />
      <Footer />
    </div>
  );
}
