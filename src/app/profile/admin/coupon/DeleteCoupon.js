import { useState } from "react";
import customAxios from "../../../../lib/api";
import { Alert } from "flowbite-react";

export default function DeleteCoupon({ token }) {
  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await customAxios(token).delete(
        "api/cart/coupon/deleteCoupon",
        { data: { code } }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setCode("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  return (
    <section className="w-[60%] px-4 py-4 mx-auto mt-5 mb-10 bg-white border shadow-sm dark:border-gray-900 dark:bg-gray-900 lg:py-4 md:px-6 rounded-lg">
      <div className="mb-6">
        <h2 className="pb-2 mb-2 text-xl font-bold text-gray-800 md:text-3xl dark:text-gray-300 text-center">
          Delete Coupon
        </h2>
        {successMessage && <Alert color="success">{successMessage}</Alert>}
        {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="coupon-code"
            className="block mb-2 text-sm font-medium dark:text-gray-400"
          >
            Code
          </label>
          <input
            id="coupon-code"
            type="text"
            className="block w-full px-4 py-3 mb-2 text-sm bg-gray-100 border rounded dark:placeholder-gray-400 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800"
            placeholder="Coupon code to delete"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-base text-gray-100 bg-blue-600 rounded hover:bg-blue-500 w-1/3"
        >
          Delete
        </button>
      </form>
    </section>
  );
}
