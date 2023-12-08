import { useState, useEffect } from "react";
import customAxios from "../../../../lib/api";
import FormSkeleton from "./FormSkeleton";
import { Alert } from "flowbite-react";
import InputField from "./InputField";

export default function FormComponent({ jwt }) {
  const [user, setUser] = useState({});
  console.log("🚀 ~ file: FormComponent.js:6 ~ FormComponent ~ user:", user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    street: "",
    streetNumber: "",
    city: "",
    municipality: "",
    zip: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!user || Object.keys(user).length === 0 || !jwt) {
      setIsLoading(true);
      setError(null);

      customAxios(jwt)
        .get("/api/users/getUser")
        .then(res => {
          setUser(res.data.user);
          setFormData(res.data.user?.address);
        })
        .catch(err => setError(err))
        .finally(() => setIsLoading(false));
    }
  }, [jwt, user]);

  console.log(
    "🚀 ~ file: FormComponent.js:18 ~ FormComponent ~ formData:",
    formData
  );

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async e => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setError(null);

    try {
      await Promise.all([
        customAxios(jwt).patch("/api/users/address", formData),
        customAxios(jwt).patch("/api/shipping/address", formData),
      ]);
      // test tomorrow, add the missing overview - could add existing

      setSuccessMessage("Address updated successfully.");
      setFormData({
        name: "",
        surname: "",
        street: "",
        streetNumber: "",
        city: "",
        municipality: "",
        zip: "",
        phoneNumber: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while updating the address."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

  return (
    <form className="max-w-xl mx-auto mt-10" onSubmit={onSubmitHandler}>
      <h3 className="mb-5">Your details for shipping:</h3>
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
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
