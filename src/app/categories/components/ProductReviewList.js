export default function ProductReviewList({ reviews }) {
  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <div key={index} className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{review.userId.username}</h3>
            <span className="text-yellow-400 text-lg">
              {"⭐".repeat(review.rating)}
            </span>
          </div>
          <p className="mt-2 text-gray-700">{review.review}</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <button className="text-green-500">👍 {review.upvotes}</button>
              <button className="ml-4 text-red-500">
                👎 {review.downvotes}
              </button>
            </div>
            <span className="text-gray-500 text-sm">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
