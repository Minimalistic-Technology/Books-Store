import Header from "./components/header/page";
import Footer from "./components/footer/page";
import HeroSection from "./components/herosection/page";


export default function Home() {
  return (
    <div className="w-full min-h-screen bg-yellow-100">
      <Header  />
      <HeroSection />
      <Footer />
    </div>
  );
}