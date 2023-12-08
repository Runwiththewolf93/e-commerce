export default function OrderPayment({ handleSubmit }) {
  return (
    <div className="w-full flex justify-center items-center mb-14">
      <form onSubmit={handleSubmit} className="w-1/2">
        <div>
          <button
            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-lg leading-4 text-white font-bold"
            type="submit"
            role="link"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
