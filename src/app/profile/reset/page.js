import { ResetPasswordForm } from "./form";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export default async function ResetPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header />
      <section className="bg-blue-600 min-h-screen pt-20">
        <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
          <ResetPasswordForm jwt={session?.customJwt} />
        </div>
      </section>
      <Footer />
    </>
  );
}
