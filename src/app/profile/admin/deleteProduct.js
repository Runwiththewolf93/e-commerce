import { useState } from "react";
import axios from "axios";

export default function DeleteProduct({ token }) {
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSearchInputChange = e => {
    setSearchName(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await axios.delete(`/api/products/deleteProduct`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          productName: searchName,
        },
      });
      setSuccessMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 my-5 sm:ml-5 ml-20 lg:mx-5 rounded-lg p-5 max-w-sm">
      <h1 className="text-center text-2xl font-bold mb-3">Delete Product</h1>
      {errorMessage && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{errorMessage}</span> Change a few
          things up and try submitting again.
        </div>
      )}
      {successMessage && (
        <div
          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3 max-w-xs">
          <label
            htmlFor="searchName"
            className="block text-sm font-medium text-gray-900 dark:text-gray-900"
          >
            Product Name
          </label>
          <input
            id="searchName"
            type="text"
            name="searchName"
            placeholder="Search Product Name"
            value={searchName}
            onChange={handleSearchInputChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
