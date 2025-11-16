import { Star } from "lucide-react";

export default function RatingModal({ rating, setRating, feedback, setFeedback, submitRating, setShowRatingModal }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4 font-sora">Rate Resolution Quality</h3>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            How satisfied are you with the resolution of your issue?
          </p>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="transition-colors">
                <Star size={32} className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
              </button>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional feedback about the resolution..."
            rows={4}
            className="w-full p-3 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowRatingModal(false)} className="flex-1 py-2 px-4 border border-[#D9D9D9] dark:border-[#404040] rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#262626]">
            Cancel
          </button>
          <button onClick={submitRating} disabled={rating === 0} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}
