import Header from "../components/Header";
import Footer from "../components/Footer";

export default async function Home() {
  return (
    <>
      <Header />
      <section className="bg-blue-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-gray-100 rounded-md h-80 flex justify-center items-center">
          <p className="text-3xl font-semibold text-slate-700">
            Welcame to NextAuth and Next.js 13
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
