import { FaTruck } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FiPackage } from "react-icons/fi";

export default function ButtonComponent({
  totalWeight,
  selectedButton,
  handleButtonClick,
}) {
  const getButtonClass = buttonId =>
    selectedButton === buttonId
      ? "inline-flex items-center justify-start px-6 py-5 me-2 overflow-hidden text-sm font-medium rounded-lg group focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-full border border-blue-500 text-blue-500"
      : "inline-flex items-center justify-start px-6 py-5 me-2 overflow-hidden text-sm font-medium rounded-lg group focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-full border border-gray-500 text-gray-500";

  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="w-full">
        <button
          className={getButtonClass(1)}
          onClick={() => handleButtonClick(1)}
        >
          <FaTruck
            className={`ml-2 h-6 w-6 ${
              selectedButton === 1 ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span className="relative pl-5 pr-5 py-2 rounded-md w-full text-left text-lg">
            Delivery to address
          </span>
        </button>
      </div>
      <div className="w-full">
        <button
          className={getButtonClass(2)}
          onClick={() => handleButtonClick(2)}
          disabled={totalWeight >= 1}
        >
          <FaLocationDot
            className={`ml-2 h-6 w-6 ${
              selectedButton === 2 ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span className="relative pl-5 pr-5 py-2 rounded-md w-full text-left text-lg">
            Parcel zone
          </span>
        </button>
      </div>
      <div className="w-full">
        <button
          className={getButtonClass(3)}
          onClick={() => handleButtonClick(3)}
          disabled={totalWeight >= 2}
        >
          <FiPackage
            className={`ml-2 h-6 w-6 ${
              selectedButton === 3 ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span className="relative pl-5 pr-5 py-2.5 rounded-md w-full text-left text-lg">
            Parcel locker
          </span>
        </button>
      </div>
    </div>
  );
}
