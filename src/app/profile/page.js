/* eslint-disable @next/next/no-img-element */
import { getServerSession } from "next-auth";
import { ProfileForm } from "./form";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { authOptions } from "../../lib/auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ file: page.js:10 ~ Profile ~ session:", session)

  return (
    <>
      <Header />
      <ProfileForm session={session} />
      <Footer />
    </>
  );
}
