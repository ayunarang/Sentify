import { useState } from "react";
import { YouTubeForm } from "./components/YoutubeForm";
import { Chart } from "./components/Chart";
import { CommentsList } from "./components/CommentsList";
import { CategoryChart } from "./components/CategoryChart";

function App() {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
<div className="max-w-5xl mx-auto px-4 py-16 bg-transparent flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        YouTube Comments Classifier
      </h1>

      <YouTubeForm onClassify={setResult} setLoading={setLoading} />

      {loading && (
        <div className="flex justify-center items-center flex-grow my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-12 flex flex-col w-full items-center align-middle justify-center">
          <Chart summary={result.summary} />
          <CategoryChart summary={result.summary} />
          <CommentsList summary={result.summary} />
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
