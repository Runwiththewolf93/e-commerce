"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Drawer from "./Drawer";
import SearchForm from "../subcomponents/SearchForm";
import { CartSVG, ProfileSVG, LogoutSVG } from "../subcomponents/SVG";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "http://localhost:3000/login" });
  };

  return (
    <header className="bg-white">
      <div className="h-20">
        <nav className="h-full flex justify-between items-center mx-3">
          <div className="flex-1">
            <Drawer />
          </div>
          <div className="flex-1 text-center">
            <Link href="/" className="text-gray-600 text-2xl font-semibold">
              E-commerce
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/" className="text-gray-600">
                  <CartSVG />
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link href="/login" className="text-gray-600">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-gray-600">
                      Register
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    <Link href="/profile" className="text-gray-600">
                      <ProfileSVG />
                    </Link>
                  </li>
                  <li className="cursor-pointer" onClick={logoutHandler}>
                    <LogoutSVG />
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
      <div className="sm:w-2/3 lg:w-1/2 mx-auto">
        <SearchForm />
      </div>
    </header>
  );
}

// make the search form sticky, check if frontpage complete.
