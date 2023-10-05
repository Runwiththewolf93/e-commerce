"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token }) {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email || !currentPassword || !newPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "/api/reset",
        {
          email,
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setSuccessMessage("Password reset successful");
      setErrorMessage(null);
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || "An unexpected error occurred"
      );
      setSuccessMessage(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-96 mx-auto mt-3 bg-slate-200 p-6 rounded-lg"
    >
      {errorMessage && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{errorMessage}.</span> Change a few
          things up and try submitting again.
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
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          aria-label="Email"
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          aria-label="Password"
        >
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          aria-label="New Password"
        >
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className={`bg-blue-500 text-white p-2 rounded-md mx-auto block hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
          loading ? "cursor-not-allowed" : ""
        }`}
      >
        Reset Password
      </button>
    </form>
  );
}
