"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import {
  resetUserPassword,
  clearUserMessage,
  clearUserError,
} from "../../../redux/slices/userSlice";
import { Alert } from "flowbite-react";

export function ResetPasswordForm({ jwt }) {
  const dispatch = useDispatch();
  const {
    isLoadingResetUserPassword,
    messageResetUserPassword,
    errorResetUserPassword,
  } = useSelector(state => state.user);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email || !currentPassword || !newPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Handling redirection after a successful password reset
    dispatch(resetUserPassword({ jwt, email, currentPassword, newPassword }))
      .then(unwrapResult)
      .then(() => setTimeout(() => router.push("/"), 2000));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-96 mx-auto mt-3 bg-slate-200 p-6 rounded-lg"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        Reset Your Password
      </h2>
      {errorResetUserPassword && (
        <Alert color="failure" onDismiss={() => dispatch(clearUserError())}>
          {errorResetUserPassword}
        </Alert>
      )}
      {messageResetUserPassword && (
        <Alert color="success" onDismiss={() => dispatch(clearUserMessage())}>
          {messageResetUserPassword}
        </Alert>
      )}
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          htmlFor="current-password"
        >
          Current Password
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          placeholder="Enter your current password"
          className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-600"
          htmlFor="new-password"
        >
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          className="mt-1 p-2 w-full border rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isLoadingResetUserPassword}
        className={`bg-blue-500 text-white p-2 rounded-md mx-auto block hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
          isLoadingResetUserPassword ? "cursor-not-allowed" : ""
        }`}
      >
        {isLoadingResetUserPassword ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
