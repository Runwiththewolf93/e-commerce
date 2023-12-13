/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { registerUser } from "../../redux/slices/userSlice";

export const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoadingRegisterUser, errorRegisterUser } = useSelector(
    state => state.user
  );
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async e => {
    e.preventDefault();

    if (!formValues.name || !formValues.email || !formValues.password) {
      setError("Please fill in all fields");
      return;
    }

    dispatch(registerUser(formValues))
      .unwrap()
      .then(() => {
        // Handle successful registration
        // Sign in the user after successful registration
        return signIn("credentials", {
          redirect: false,
          email: formValues.email,
          password: formValues.password,
          callbackUrl,
        });
      })
      .then(signInRes => {
        if (!signInRes?.error) {
          setFormValues({ name: "", email: "", password: "" });
          router.push(callbackUrl);
        } else {
          setError(signInRes.error);
        }
      });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue focus:outline-none";

  return (
    <form onSubmit={onSubmit}>
      {(error || errorRegisterUser) && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">
          {error || errorRegisterUser}
        </p>
      )}
      <h2 className="text-center text-2xl font-bold mb-6">Register</h2>
      <div className="mb-6">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-600"
        >
          Name
        </label>
        <input
          required
          type="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Name"
          className={`${input_style}`}
        />
      </div>
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
          isLoadingRegisterUser ? "bg-gray-300" : "bg-blue-600"
        }`}
        disabled={isLoadingRegisterUser}
      >
        {isLoadingRegisterUser ? "Loading..." : "Sign Up"}
      </button>
    </form>
  );
};
