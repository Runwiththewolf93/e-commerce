"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Drawer from "./Drawer";
import SearchForm from "../subcomponents/SearchForm";
import { BsCart3 } from "react-icons/bs";
import { BiUser, BiLogOut } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PURGE } from "redux-persist";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const [sticky, setSticky] = useState(false);
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "http://localhost:3000/login" });
    localStorage.removeItem("persist:root");
    dispatch({
      type: PURGE,
      key: "root",
      result: () => null,
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`bg-white ${sticky ? "sticky top-0 z-50" : ""}`}>
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
                  <BsCart3 className="h-6 w-6" />
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
                      <BiUser className="w-6 h-6" />
                    </Link>
                  </li>
                  <li className="cursor-pointer" onClick={logoutHandler}>
                    <BiLogOut className="w-6 h-6" />
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
