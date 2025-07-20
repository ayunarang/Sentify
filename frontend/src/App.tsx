import { useState } from "react";
import { YouTubeForm } from "./components/YoutubeForm";
import { Chart } from "./components/Chart";
import { CommentsList } from "./components/CommentsList";
import { CategoryChart } from "./components/CategoryChart";

function App() {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300 w-full">
      <main className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center">
          YouTube Comments Classifier
        </h1>

        <YouTubeForm onClassify={setResult} setLoading={setLoading} />

        <section aria-live="polite">
          <div
            className={`transition-opacity duration-700 ease-in-out ${
              !result ? "opacity-100 mt-6" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <p className="text-gray-400 text-sm text-center max-w-2xl mx-auto px-4">
              This tool analyzes YouTube comments from a given video using our
              trained model and automatically classifies them into sentiments
              like <span className="font-semibold text-white">Positive</span>,{" "}
              <span className="font-semibold text-white">Negative</span>,{" "}
              <span className="font-semibold text-white">Funny</span>,{" "}
              <span className="font-semibold text-white">Neutral</span>,{" "}
              <span className="font-semibold text-white">Question</span>, and{" "}
              <span className="font-semibold text-white">Spam</span>.
            </p>

            <div className="relative mt-24 md:mt-20 flex justify-center items-center">
              <img
                src="/placeholder.svg"
                alt="Illustration showing analysis"
                loading="lazy"
                className="max-w-xs h-auto opacity-30"
              />

              {loading && (
                <div
                  className="absolute inset-0 flex justify-center items-center"
                  aria-busy="true"
                  aria-label="Loading analysis"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
          </div>

          <h2
            className={`text-md font-medium text-center text-green-400 transition-opacity duration-700 ease-in-out ${
              result ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            Analyzed Top 200 Comments from YouTube Video!
          </h2>
        </section>

        <div
          className={`transition-all duration-700 ease-in-out w-full ${
            result && !loading ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          {result && !loading && (
            <section className="space-y-12 flex flex-col items-center">
              <Chart label_counts={result.label_counts} />
              <CategoryChart label_counts={result.label_counts} />
              <CommentsList summary={result.summary} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
