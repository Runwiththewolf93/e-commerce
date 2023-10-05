import { ResetPasswordForm } from "./form";
import Header from "../../components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header />
      <section className="bg-blue-600 min-h-screen pt-20">
        <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
          <ResetPasswordForm token={session?.customJwt} />
        </div>
      </section>
    </>
  );
}
