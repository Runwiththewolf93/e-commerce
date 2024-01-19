/* eslint-disable @next/next/no-img-element */
"use client";

import ProfileOverview from "./components/ProfileOverview";
import OrderOverview from "./components/OrderOverview";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCustomSession } from "../hooks/useCustomSession";

/**
 * Renders the profile page.
 *
 * @return {JSX.Element} The rendered profile page.
 */
export default function ProfilePage() {
  const { data: session } = useCustomSession();

  return (
    <>
      <Header />
      <section className="bg-blue-400 min-h-screen py-20">
        <div className="flex flex-col gap-20 mx-20 lg:flex-row 2xl:gap-64 2xl:mx-64">
          <ProfileOverview session={session} />
          <OrderOverview session={session} />
        </div>
      </section>
      <Footer />
    </>
  );
}
