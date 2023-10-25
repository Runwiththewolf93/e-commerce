import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CategoriesLayout({ children }) {
  return (
    <>
      <Header />
      <section className="min-h-screen">{children}</section>
      <Footer />
    </>
  );
}
