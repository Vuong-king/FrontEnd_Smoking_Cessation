import React from "react";
import { Trash } from "lucide-react";
import useFeedbacks from "../../../hook/useFeedbacks";

const Feedbacks = () => {
  const { feedbacks, toast, deleteFeedback } = useFeedbacks();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white relative">
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg z-50 text-sm transition-all duration-300 ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            User Feedback
          </span>
        </h2>
        <p className="text-white/70">Review feedback from platform users.</p>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-center text-white/60 text-lg">No feedback found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
            >
              <h3 className="text-lg font-semibold mb-1">{f.subject}</h3>
              <p className="text-sm text-white/70 mb-1">From: {f.email}</p>
              <p className="text-sm text-white/50 mb-3">Type: {f.type}</p>
              <p className="text-sm mb-4">{f.message}</p>
              <div className="text-right">
                <button
                  onClick={() => deleteFeedback(f.id)}
                  className="text-xs flex items-center gap-1 px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white"
                >
                  <Trash className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Feedbacks;
