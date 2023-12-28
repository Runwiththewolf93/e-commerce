"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Jumbotron() {
  const bgImages = [
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/images/_14e77b62-6bba-4aa8-b890-ace7a3bbf886.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/images/_1c2f2040-fd5a-4776-acb8-accb5d789372.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/images/_57a2dfdd-9b71-4ddd-b213-7acbc4d8e132.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/images/_207dfe9f-0f21-4e30-8754-038f5b8d31e3.png",
    "https://raw.githubusercontent.com/Runwiththewolf93/e-commerce/master/public/images/_797cc559-aa06-44d3-824b-df0d430ecfd3.png",
  ];

  const [currentBg, setCurrentBg] = useState(bgImages[0]);
  const [nextBg, setNextBg] = useState(bgImages[1]);
  const [toggle, setToggle] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      setToggle(!toggle);
      setCurrentBg(bgImages[index]);
      index = (index + 1) % bgImages.length;
      setNextBg(bgImages[index]);
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  return (
    <section className="relative">
      <div
        className={`absolute inset-0 bg-center bg-cover transition-opacity duration-3000 ease-in-out ${
          toggle ? "opacity-0" : "opacity-100"
        } z-0`}
        style={{ backgroundImage: `url(${currentBg})` }}
      ></div>
      <div
        className={`absolute inset-0 bg-center bg-cover transition-opacity duration-3000 ease-in-out ${
          toggle ? "opacity-100" : "opacity-0"
        } z-0`}
        style={{ backgroundImage: `url(${nextBg})` }}
      ></div>
      <div className="absolute inset-0 bg-gray-700 bg-opacity-90 z-10"></div>
      <div className="relative z-20">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-12 lg:py-28">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            Welcome to Our Store!
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Find the best products at unbeatable prices. Sign up now and get a
            10% discount on your first purchase! Experience quality and customer
            service like never before.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            {!session?.user && (
              <Link
                href="/register"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              >
                Sign Up
                <svg
                  className="w-3.5 h-3.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            )}
            <Link
              href="#"
              className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
