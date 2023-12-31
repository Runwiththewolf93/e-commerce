import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  clearProductMessage,
  clearProductError,
} from "../../../redux/slices/productSlice";
import { Alert } from "flowbite-react";

export default function AddProduct({ token }) {
  const dispatch = useDispatch();
  const { isLoadingAddProduct, messageAddProduct, errorAddProduct } =
    useSelector(state => state.products);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    category: "",
    discount: {
      percentage: "",
      startDate: "",
      endDate: "",
    },
    images: [{ url: "", alt: "" }],
  });
  const [errorMessage, setErrorMessage] = useState(null);

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
    const { name, description, price, stock, weight, category, images } =
      formData;
    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !weight ||
      !category ||
      !images
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!isFormValid()) {
      setErrorMessage("Please fill all the fields");
      return;
    }

    dispatch(addProduct({ product: formData, jwt: token })).then(() => {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        weight: "",
        category: "",
        discount: {
          percentage: "",
          startDate: "",
          endDate: "",
        },
        images: [{ url: "", alt: "" }],
      });
    });
  };

  return (
    <div className="bg-gray-200 my-5 rounded-lg p-5 max-w-max">
      <h1 className="text-center text-2xl font-bold mb-3">Add Product</h1>
      {(errorMessage || errorAddProduct) && (
        <Alert
          color="failure"
          onDismiss={() => {
            setErrorMessage(null);
            dispatch(clearProductError());
          }}
        >
          {errorMessage || errorAddProduct}
        </Alert>
      )}
      {messageAddProduct && (
        <Alert
          color="success"
          onDismiss={() => {
            dispatch(clearProductMessage());
          }}
        >
          {messageAddProduct}
        </Alert>
      )}
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
            value={formData.name}
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
            value={formData.description}
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
            value={formData.price}
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
            value={formData.stock}
            onChange={handleInputChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-900 dark:text-gray-900"
          >
            Weight
          </label>
          <input
            id="weight"
            type="number"
            name="weight"
            placeholder="Weight"
            value={formData.weight}
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
            value={formData.category}
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
        {formData.images.map((image, index) => (
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
              value={image.url}
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
              value={image.alt}
              onChange={e => handleImageChange(e, index)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        ))}
        <div className="block sm:flex sm:justify-between mt-5 sm:mt-3">
          <button
            type="button"
            onClick={addImageField}
            disabled={isLoadingAddProduct}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-3 mb-3 sm:mb-0 whitespace-nowrap"
          >
            Add Image
          </button>
          <button
            type="submit"
            disabled={isLoadingAddProduct}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 whitespace-nowrap"
          >
            {isLoadingAddProduct ? "Processing..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
