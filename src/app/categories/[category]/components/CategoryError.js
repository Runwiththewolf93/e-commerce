import { useDispatch } from "react-redux";
import { fetchCategory } from "../../../../redux/slices/productSlice";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

/**
 * Renders an error message for a specific category.
 *
 * @param {String} errorCategory - The error category string.
 * @return {JSX.Element} The rendered error message.
 */
export default function CategoryError({ errorCategory, link }) {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(fetchCategory(link));
  };

  return (
    <div className="min-h-screen col-span-3">
      <Alert color="failure" icon={HiInformationCircle} className="text-xl">
        <div className="flex font-medium">
          <p>
            <span>{errorCategory}.</span>
          </p>
          <button
            onClick={handleRefresh}
            className="ml-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </Alert>
    </div>
  );
}
