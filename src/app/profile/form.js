/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function ProfileForm({ session }) {
  const user = session?.user;

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const userId = user.id;

    try {
      setLoading(true);
      await axios.patch(`/api/users/address/${userId}`, formData, {
        headers: { Authorization: `Bearer ${session.customJwt}` },
      });
      setLoading(false);
      setSuccessMessage("Address updated successfully");
      setErrorMessage(null);
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || "An unexpected error occurred"
      );
      setSuccessMessage(null);
    }
  };

  const inputFields = [
    {
      label: "Street",
      name: "street",
    },
    {
      label: "City",
      name: "city",
    },
    {
      label: "State",
      name: "state",
    },
    {
      label: "ZIP Code",
      name: "zip",
    },
    {
      label: "Country",
      name: "country",
    },
  ];

  return (
    <section className="bg-blue-400 min-h-screen py-20">
      <div className="max-w-4xl mx-auto bg-gray-100 rounded-md flex justify-center items-center py-6">
        <div>
          <p className="mb-3 text-5xl text-center font-semibold">
            Profile Page
          </p>
          {!user ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="flex items-center gap-8">
                <div>
                  <img
                    src={user.image ? user.image : "/images/default.svg"}
                    className="max-h-36"
                    alt={`profile photo of ${user.name}`}
                  />
                </div>
                <div className="mt-3">
                  <p className="mb-3">Name: {user.name}</p>
                  <p className="mb-3">Email: {user.email}</p>
                  <button
                    className="bg-blue-500 text-white font-mono font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-300 ease-in-out"
                    onClick={() => router.push("/reset")}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
              <div className="h-1 bg-black my-3" />
              <form
                onSubmit={handleSubmit}
                className="space-y-4 w-96 mx-auto mt-3 bg-slate-200 p-6 rounded-lg"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">
                    Update Your Address
                  </h2>
                  <p className="text-sm text-gray-600">
                    Enter your address details to complete your profile
                  </p>
                </div>
                {errorMessage && (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                  >
                    <span className="font-medium">{errorMessage}.</span> Change
                    a few things up and try submitting again.
                  </div>
                )}
                {successMessage && (
                  <div
                    className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                    role="alert"
                  >
                    <span className="font-medium">{successMessage}.</span>
                  </div>
                )}
                {inputFields.map((field, index) => (
                  <div key={index}>
                    <label
                      className="block text-sm font-medium text-gray-600"
                      aria-label={field.label}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.label}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded-md mx-auto block hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                >
                  Update Address
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
