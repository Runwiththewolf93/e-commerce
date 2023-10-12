import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import DefaultCarousel from "../components/Carousel";

export default function Home() {
  return (
    <div className="bg-sky-400">
      <Header />
      <Jumbotron />
      <DefaultCarousel />
      <div className="min-h-screen" />
      <Footer />
    </div>
  );
}
