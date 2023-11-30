import Header from "../../components/Header";
import Footer from "../../components/Footer";
import sessionWrapper from "./shared/sessionWrapper";
import CartRedirect from "./components/CartRedirect";

function CartLayout({ children, session }) {
  return (
    <>
      <Header />
      <section className="min-h-screen">
        {session ? children : <CartRedirect />}
      </section>
      <Footer />
    </>
  );
}

export default sessionWrapper(CartLayout);
