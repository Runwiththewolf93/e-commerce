import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { fetchProduct } from "../../../../../redux/slices/productSlice";

export default function ProductError({ errorMessage, productId }) {
  const dispatch = useDispatch();

  const handleRetry = () => {
    dispatch(fetchProduct(productId));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Alert
        color="failure"
        icon={HiInformationCircle}
        className="text-xl mb-4"
      >
        <span className="font-bold text-lg">{errorMessage}</span>
      </Alert>
      <button onClick={handleRetry} className="text-blue-600 hover:underline">
        Try again
      </button>
    </div>
  );
}
