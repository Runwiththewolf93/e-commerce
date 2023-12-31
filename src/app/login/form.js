/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async e => {
    e.preventDefault();

    if (!formValues.email || !formValues.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });
      console.log("🚀 ~ file: form.js:34 ~ onSubmit ~ res:", res);

      setLoading(false);
      if (!res?.error) {
        setFormValues({ email: "", password: "" });
        router.push(callbackUrl);
      } else {
        setError(res.error);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "An unknown error occurred";
      setError(errorMessage);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue focus:outline-none";

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
      )}
      <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600"
        >
          Email Address
        </label>
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email address"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-600"
        >
          Password
        </label>
        <input
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Password"
          className={`${input_style}`}
        />
      </div>
      <button
        type="submit"
        className={`inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full ${
          loading ? "bg-gray-300" : "bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "loading..." : "Sign In"}
      </button>

      <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
        <p className="text-center font-semibold mx-4 mb-0">OR</p>
      </div>

      <a
        className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3 bg-[#3b5998]"
        onClick={() => signIn("google", { callbackUrl })}
        role="button"
      >
        <img className="pr-2 h-8" src="/images/google.svg" alt="google" />
        Continue with Google
      </a>
      <a
        className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center bg-[#55acee]"
        onClick={() => signIn("github", { callbackUrl })}
        role="button"
      >
        <img className="pr-2 h-8" src="/images/github.svg" alt="github" />
        Continue with Github
      </a>
    </form>
  );
};
