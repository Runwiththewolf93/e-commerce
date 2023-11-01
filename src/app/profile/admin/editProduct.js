import { useState } from "react";
import customAxios from "../../../lib/api";

export default function EditProduct({ token }) {
  const [searchName, setSearchName] = useState("");
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSearchInputChange = e => {
    setSearchName(e.target.value);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDiscountChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      discount: {
        ...formData.discount,
        [name]: value,
      },
    });
  };

  const handleImageChange = (e, index) => {
    const { name, value } = e.target;
    const newImages = [...formData.images];
    newImages[index][name] = value;
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", alt: "" }],
    });
  };

  const isFormValid = () => {
    const { name, description, price, stock, category, images } = formData;
    if (!name || !description || !price || !stock || !category || !images) {
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!isFormValid()) {
      setErrorMessage("Do not remove existing data from fields");
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await customAxios(token).patch(
        "/api/products/editProduct",
        formData
      );
      setSuccessMessage(response.data.message);
      setFormData(null);
      setSearchName("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await customAxios(token).post(
        `/api/products/getProduct`,
        {
          productName: searchName,
        }
      );
      setFormData(response.data.product);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 my-5 rounded-lg p-5 max-w-max self-start">
      <h1 className="text-center text-2xl font-bold mb-3">Edit Product</h1>
      {errorMessage && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 max-w-xs"
          role="alert"
        >
          <span className="font-medium">{errorMessage}</span> Change a few
          things up and try submitting again.
        </div>
      )}
      {successMessage && (
        <div
          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 max-w-xs"
          role="alert"
        >
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
      {!formData && (
        <form>
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
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            Search
          </button>
        </form>
      )}
      {formData && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Product Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              value={formData?.name}
              onChange={handleInputChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData?.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></textarea>
          </div>
          <div className="mb-3">
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Price
            </label>
            <input
              id="number"
              type="number"
              name="price"
              placeholder="Price"
              value={formData?.price}
              onChange={handleInputChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Stock
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData?.stock}
              onChange={handleInputChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-900 dark:gray-900"
            >
              Product Category
            </label>
            <select
              id="category"
              name="category"
              value={formData?.category}
              onChange={handleInputChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Books">Books</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
              <option value="Cars & Motorcycles">Cars & Motorcycles</option>
              <option value="Groceries & Food">Groceries & Food</option>
              <option value="Office Supplies & Stationery">
                Office Supplies & Stationery
              </option>
            </select>
          </div>
          <div className="mb-3">
            <label
              htmlFor="percentage"
              className="block text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Discount Percentage
            </label>
            <input
              id="percentage"
              type="number"
              name="percentage"
              placeholder="Discount Percentage"
              value={formData?.discount?.percentage || ""}
              onChange={handleDiscountChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <input
              type="date"
              name="startDate"
              placeholder="Discount Start Date"
              value={formData?.discount?.startDate || ""}
              onChange={handleDiscountChange}
            />
            <input
              type="date"
              name="endDate"
              placeholder="Discount End Date"
              value={formData?.discount?.endDate || ""}
              onChange={handleDiscountChange}
            />
          </div>
          {formData?.images.map((image, index) => (
            <div key={index} className="mb-3">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-900 dark:text-gray-900"
              >
                Image URL
              </label>
              <input
                id="imageUrl"
                type="text"
                name="url"
                placeholder="Image URL"
                value={image?.url}
                onChange={e => handleImageChange(e, index)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-900 dark:text-gray-900"
              >
                Image ALT
              </label>
              <input
                id="imageUrl"
                type="text"
                name="alt"
                placeholder="Image Alt Text"
                value={image?.alt}
                onChange={e => handleImageChange(e, index)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          ))}
          <div className="block sm:flex sm:justify-between mt-5 sm:mt-3">
            <button
              type="button"
              onClick={addImageField}
              disabled={isLoading}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-3 mb-3 sm:mb-0"
            >
              Add Image
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {isLoading ? "Processing..." : "Edit Product"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
