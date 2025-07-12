import { useState } from "react";

interface YouTubeFormProps {
  onClassify: (data: any) => void;
  setLoading: (data: boolean) => void; 
}

export const YouTubeForm: React.FC<YouTubeFormProps> = ({ onClassify, setLoading }) => {
  const [url, setUrl] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url){
      alert("Please neter a URL")
      return;
    }

    setLocalLoading(true);
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/classify?youtube_url=${encodeURIComponent(url)}`,
        { method: "POST" }
      );
      const data = await response.json();
      onClassify(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLocalLoading(false);
      setLoading(false); 
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="mb-8 flex flex-col md:flex-row gap-4 w-full max-w-lg"
      >
        <input
          type="text"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={localLoading}
          className="border border-gray-300 rounded px-4 py-2 w-full text-white"
        />
        <button
          type="submit"
          disabled={localLoading}
          className={`${
            localLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-6 py-2 rounded transition-colors max-w-fit mx-auto md:mx-0 cursor-pointer`}
        >
          {localLoading ? "Classifying..." : "Classify"}
        </button>
      </form>
    </div>
  );
};
