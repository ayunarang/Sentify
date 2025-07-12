import React, { useState } from "react";

interface CommentsListProps {
  summary: Record<string, string[]>;
}

export const CommentsList: React.FC<CommentsListProps> = ({ summary }) => {
  const labels = Object.keys(summary);
  const [activeTab, setActiveTab] = useState(labels[0]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-transparent">
      <div className="flex flex-wrap gap-2 mb-4">
        {labels.map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition 
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

      <div className="bg-gray-300 border border-gray-300 rounded-lg shadow p-6">
        <h4 className="text-xl font-semibold mb-4">
          {activeTab.toUpperCase()}
        </h4>
        <ul className="space-y-4">
          {summary[activeTab]?.slice(0, 10).map((comment, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-gray-800 text-base leading-relaxed"
            >
              <span className="mt-1 text-blue-500">•</span>
              <p>{comment}</p>
            </li>
          ))}

          {summary[activeTab]?.length === 0 && (
            <p className="text-gray-500">No comments found for this category.</p>
          )}
        </ul>
      </div>
    </div>
  );
};
