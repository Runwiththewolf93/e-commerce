/* eslint-disable @next/next/no-img-element */
import { getServerSession } from "next-auth";
import { ProfileForm } from "./form";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { authOptions } from "../../lib/auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header />
      <ProfileForm session={session} />
      <Footer />
    </>
  );
}
