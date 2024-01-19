import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reactReduxHooks";
import FormSkeleton from "./FormSkeleton";
import { Alert } from "flowbite-react";
import InputField from "./InputField";
import {
  getUser,
  userAddress,
  clearUserMessage,
  clearUserError,
} from "../../../../redux/slices/userSlice";
import {
  orderAddress,
  clearOrderMessage,
  clearOrderError,
  setIsAddressSubmitted,
} from "../../../../redux/slices/orderSlice";

interface FormComponentProps {
  jwt: string;
  cartId: string;
}

/**
 * Renders a form component for submitting user address information.
 *
 * @param {Object} props - The props object containing the function parameters.
 * @param {string} props.jwt - The JSON Web Token for authentication.
 * @param {string} props.cartId - The ID of the cart.
 * @return {JSX.Element} - The rendered form component.
 */
export default function FormComponent({ jwt, cartId }: FormComponentProps) {
  const dispatch = useAppDispatch();
  const {
    isLoadingGetUser,
    user,
    errorGetUser,
    isLoadingUserAddress,
    messageUserAddress,
    errorUserAddress,
  } = useAppSelector(state => state.user);
  const { isLoadingOrderAddress, messageOrderAddress, errorOrderAddress } =
    useAppSelector(state => state.order);
  console.log("🚀 ~ file: FormComponent.tsx:42 ~ FormComponent ~ user:", user);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    street: "",
    streetNumber: 0,
    city: "",
    municipality: "",
    zip: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Check if user data is not present and jwt token is available
    if (!user._id && jwt) {
      dispatch(getUser({ jwt }));
    }
  }, [jwt, user, dispatch]);

  useEffect(() => {
    if (user?.address && Object.keys(user.address).length > 0) {
      setFormData(user.address);
    }
  }, [user]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: name === "streetNumber" ? parseInt(value) || 0 : value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Dispatch the update address action for user and order
    const results = await Promise.all([
      dispatch(userAddress({ jwt, address: formData })),
      dispatch(orderAddress({ jwt, address: formData, cartId })),
    ]);

    // Check if both actions were successful
    if (
      userAddress.fulfilled.match(results[0]) &&
      orderAddress.fulfilled.match(results[1])
    ) {
      dispatch(setIsAddressSubmitted(true));
      setFormData({
        name: "",
        surname: "",
        street: "",
        streetNumber: 0,
        city: "",
        municipality: "",
        zip: "",
        phoneNumber: "",
      });
    }
  };

  const isLoading = isLoadingUserAddress || isLoadingOrderAddress;
  const successMessage =
    messageUserAddress && messageOrderAddress
      ? "Address updated successfully."
      : null;
  const error = errorGetUser || errorUserAddress || errorOrderAddress;

  if (isLoadingGetUser) {
    return <FormSkeleton />;
  }

  return (
    <form className="max-w-xl mx-auto mt-10" onSubmit={onSubmitHandler}>
      {/* <button onClick={() => dispatch(setIsAddressSubmitted(false))}>
        address
      </button> */}
      <h3 className="mb-5 text-lg">Your details for shipping:</h3>
      {successMessage && (
        <Alert
          color="success"
          className="mb-3"
          onDismiss={() => {
            dispatch(clearUserMessage());
            dispatch(clearOrderMessage());
          }}
        >
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert
          color="failure"
          className="mb-3"
          onDismiss={() => {
            dispatch(clearUserError());
            dispatch(clearOrderError());
          }}
        >
          {error}
        </Alert>
      )}
      <div className="grid md:grid-cols-2 md:gap-6">
        <InputField
          name="name"
          type="text"
          value={formData?.name}
          onChange={onChangeHandler}
          placeholder=""
          label="Name"
        />
        <InputField
          name="surname"
          type="text"
          value={formData?.surname}
          onChange={onChangeHandler}
          placeholder=""
          label="Surname"
        />
      </div>
      <div className="grid md:grid-cols-3 md:gap-6">
        <InputField
          name="street"
          type="text"
          value={formData?.surname}
          onChange={onChangeHandler}
          placeholder=""
          label="Street"
        />
        <InputField
          name="streetNumber"
          type="number"
          value={formData?.streetNumber}
          onChange={onChangeHandler}
          placeholder=""
          label="Street Number"
        />
        <InputField
          name="phoneNumber"
          type="text"
          value={formData?.phoneNumber}
          onChange={onChangeHandler}
          placeholder=""
          label="Phone Number"
        />
      </div>
      <div className="grid md:grid-cols-3 md:gap-6">
        <InputField
          name="city"
          type="text"
          value={formData?.city}
          onChange={onChangeHandler}
          placeholder=""
          label="City"
        />
        <InputField
          name="municipality"
          type="text"
          value={formData?.municipality}
          onChange={onChangeHandler}
          placeholder=""
          label="Municipality"
        />
        <InputField
          name="zip"
          type="text"
          value={formData?.zip}
          onChange={onChangeHandler}
          placeholder=""
          label="Zip Code"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
}
