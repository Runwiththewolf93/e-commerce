import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  clearProductMessage,
  clearProductError,
} from "../../../redux/slices/productSlice";
import { Alert } from "flowbite-react";

export default function DeleteProduct({ token }) {
  const dispatch = useDispatch();
  const { isLoadingDeleteProduct, messageDeleteProduct, errorDeleteProduct } =
    useSelector(state => state.products);
  const [searchName, setSearchName] = useState("");

  const handleSearchInputChange = e => {
    setSearchName(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(deleteProduct({ productName: searchName, jwt: token }));
  };

  return (
    <div className="bg-gray-200 my-5 rounded-lg p-5 max-w-max self-start">
      <h1 className="text-center text-2xl font-bold mb-3">Delete Product</h1>
      {errorDeleteProduct && (
        <Alert color="failure" onDismiss={() => dispatch(clearProductError())}>
          {errorDeleteProduct}
        </Alert>
      )}
      {messageDeleteProduct && (
        <Alert
          color="success"
          onDismiss={() => dispatch(clearProductMessage())}
        >
          {messageDeleteProduct}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
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
          disabled={isLoadingDeleteProduct}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min-w-min"
        >
          {isLoadingDeleteProduct ? "Deleting..." : "Delete"}
        </button>
      </form>
    </div>
  );
}
