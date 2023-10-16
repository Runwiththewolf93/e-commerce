import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import DefaultCarousel from "../components/Carousel";
import Banner from "../components/Banner";
import GalleryBestsellers from "../components/GalleryBestsellers";
import CategoryGrid from "../components/CategoryGrid";
import GalleryFeatured from "../components/GalleryFeatured";

export default function Home() {
  return (
    <div className="bg-sky-400">
      <Header />
      <Jumbotron />
      <div className="divider" />
      <DefaultCarousel />
      <div className="divider" />
      <GalleryBestsellers />
      <div className="divider" />
      <CategoryGrid />
      <div className="divider" />
      <GalleryFeatured />
      <div className="divider" />
      <Banner />
      <Footer />
    </div>
  );
}
