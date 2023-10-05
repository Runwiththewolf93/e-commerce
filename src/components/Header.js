"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "http://localhost:3000/login" });
  };

  return (
    <header className="bg-white h-20">
      <nav className="h-full flex justify-between items-center mx-3">
        <div>
          <Link href="/" className="text-gray-600 text-2xl font-semibold">
            Nextjs
          </Link>
        </div>
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/" className="text-gray-600">
              Home
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
                  Profile
                </Link>
              </li>
              <li className="cursor-pointer" onClick={logoutHandler}>
                Logout
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
