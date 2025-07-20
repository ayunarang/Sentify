import React, { useState } from "react";

interface CommentsListProps {
  summary: Record<string, string[]>;
}

export const CommentsList: React.FC<CommentsListProps> = ({ summary }) => {
  const labels = Object.keys(summary);
  const [activeTab, setActiveTab] = useState(labels[0]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-transparent">
      <h1 className="text-xl font-semibold mb-6 text-white text-start md:text-center">
        Top 5 Comments in Each Category:
      </h1>

      <div role="tablist" aria-label="Comment Categories" className="flex flex-wrap md:justify-center justify-start gap-2 mb-6">
        {labels.map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            role="tab"
            aria-selected={activeTab === label}
            aria-controls={`panel-${label}`}
            id={`tab-${label}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
              ${
                activeTab === label
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="relative min-h-[500px] max-h-fit transition-all duration-500 ease-in-out overflow-auto">
        {labels.map((label) => (
          <div
            key={label}
            id={`panel-${label}`}
            role="tabpanel"
            aria-labelledby={`tab-${label}`}
            className={`
              absolute inset-0 transition-opacity duration-500 ease-in-out
              ${activeTab === label ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
              bg-gray-300 border border-gray-300 rounded-lg shadow p-6 overflow-y-auto
            `}
          >
            <h4 className="text-xl font-semibold mb-4 text-black text-start">
              {label.toUpperCase()}
            </h4>

            <ul className="space-y-4">
              {summary[label]?.slice(0, 5).map((comment, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-gray-800 text-base leading-relaxed"
                >
                  <span className="mt-1 text-blue-500">•</span>
                  <p>{comment}</p>
                </li>
              ))}

              {summary[label]?.length === 0 && (
                <p className="text-gray-500">No comments found for this category.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
