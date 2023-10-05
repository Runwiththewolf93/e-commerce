"use client";

import { useState } from "react";
import axios from "axios";

export function ResetPasswordForm({ token }) {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios.post(
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

      console.log("Password reset successful:", response.data);
      setSuccessMessage("Password reset successful");
      setErrorMessage(null);
    } catch (error) {
      console.error("An error occurred:", error);
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
        <label className="block text-sm font-medium text-gray-600">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md mx-auto block"
      >
        Reset Password
      </button>
    </form>
  );
}
