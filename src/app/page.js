"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Jumbotron from "../components/Jumbotron";
import DefaultCarousel from "../components/Carousel";
import Banner from "../components/Banner";
import GalleryBestSellers from "../components/GalleryBestSellers";
import CategoryGrid from "../components/CategoryGrid";
import GalleryFeatured from "../components/GalleryFeatured";
import UserTestimonial from "../components/UserTestimonial";
import GalleryNewArrivals from "../components/GalleryNewArrivals";
import SocialProof from "../components/SocialProof";
import { useSelector } from "react-redux";
import CartOverlay from "./cart/overlay/page";

export default function Home() {
  const { isCartOpen } = useSelector(state => state.cart);

  return (
    <div className="bg-sky-300">
      <Header />
      <Jumbotron />
      <div className="divider" />
      <DefaultCarousel />
      <div className="divider" />
      <GalleryBestSellers />
      <div className="divider" />
      <CategoryGrid />
      <div className="divider" />
      <GalleryFeatured />
      <div className="divider" />
      <UserTestimonial />
      <div className="divider" />
      <GalleryNewArrivals />
      <div className="divider" />
      <SocialProof />
      <div className="divider" />
      <Banner />
      <Footer />
      {isCartOpen ? <CartOverlay /> : null}
    </div>
  );
}
