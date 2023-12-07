import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

export default function AlertComponent({ totalWeight }) {
  return (
    <div className="mt-5">
      {totalWeight >= 1 && (
        <Alert
          color="info"
          icon={HiInformationCircle}
          className="mb-3 text-base"
        >
          <span className="pt-1">
            Parcel Zones can receive packages weighing up to 1 kg. Due to
            specific characteristics, some packages cannot be delivered in this
            way.
          </span>
        </Alert>
      )}
      {totalWeight >= 2 && (
        <Alert color="info" icon={HiInformationCircle} className="text-base">
          <span className="pt-1">
            Packages weighing up to 2 kg can be picked up from Parcel Lockers.
            Due to specific characteristics, some packages cannot be delivered
            in this way.
          </span>
        </Alert>
      )}
    </div>
  );
}
