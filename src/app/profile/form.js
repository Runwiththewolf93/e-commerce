/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Spinner, Alert } from "flowbite-react";
import {
  userAddress,
  clearUserMessage,
  clearUserError,
} from "../../redux/slices/userSlice";

export function ProfileForm({ session }) {
  const user = session?.user;
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoadingUserAddress, messageUserAddress, errorUserAddress } =
    useSelector(state => state.user);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    street: "",
    streetNumber: "",
    city: "",
    municipality: "",
    zip: "",
    phoneNumber: "",
  });
  const [validationError, setValidationError] = useState("");
  console.log("🚀 ~ file: form.js:22 ~ ProfileForm ~ formData:", formData);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(
      field => field.trim() !== ""
    );
    if (!allFieldsFilled) {
      setValidationError("Please fill in all fields");
      return;
    }
    setValidationError("");

    dispatch(userAddress({ jwt: session?.customJwt, address: formData }));
  };

  const inputFields = [
    {
      label: "Name",
      name: "name",
    },
    {
      label: "Surname",
      name: "surname",
    },
    {
      label: "Street",
      name: "street",
    },
    {
      label: "Street Number",
      name: "streetNumber",
    },
    {
      label: "City",
      name: "city",
    },
    {
      label: "Municipality",
      name: "municipality",
    },
    {
      label: "ZIP Code",
      name: "zip",
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
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
            <Spinner />
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
                  <div className="flex gap-3 mt-4">
                    <button
                      className="bg-blue-500 text-white font-mono font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-300 ease-in-out"
                      onClick={() => router.push("/reset")}
                    >
                      Reset Password
                    </button>
                    <button
                      className="bg-green-500 text-white font-mono font-semibold py-2 px-4 rounded-md hover:bg-green-600 focus:bg-green-700 focus:outline-none focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors duration-300 ease-in-out"
                      onClick={() => router.push("/profile/wishlist")}
                    >
                      Go to Wishlist
                    </button>
                  </div>
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
                {errorUserAddress && (
                  <Alert
                    color="failure"
                    onDismiss={() => dispatch(clearUserError())}
                  >
                    {errorUserAddress}
                  </Alert>
                )}
                {validationError && (
                  <Alert color="failure">{validationError}</Alert>
                )}
                {messageUserAddress && (
                  <Alert
                    color="success"
                    onDismiss={() => dispatch(clearUserMessage())}
                  >
                    {messageUserAddress}
                  </Alert>
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
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded-md mx-auto block hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                    isLoadingUserAddress ? "cursor-not-allowed" : ""
                  }`}
                  disabled={isLoadingUserAddress}
                >
                  {isLoadingUserAddress ? "Updating..." : "Update Address"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
