from fastapi import FastAPI, Query
import joblib
import pandas as pd
import re
import html
from fastapi.middleware.cors import CORSMiddleware
from youtube_comments import get_video_id, get_comments
from fastapi.responses import JSONResponse


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

vectorizer = joblib.load("vectorizer.pkl")
clf = joblib.load("classifier.pkl")
encoder = joblib.load("label_encoder.pkl")

KEEP_EMOJIS = [
    "😂", "🤣", "💀", "🤡",
    "🙂", "😊", "😀", "😃", "😄", "😁", "😆", "😍", "❤️",
    "💰", "💸", "🤑"
]


def clean_text(text):
    text = html.unescape(str(text).lower())

    text = re.sub(r"http\S+", "", text) 

    text = re.sub(r'<a.*?>.*?</a>', '', text, flags=re.DOTALL | re.IGNORECASE)

    text = re.sub(r'<.*?>', '', text)

    emoji_pattern = "".join(KEEP_EMOJIS)
    regex = rf"[^a-zA-Z\s{emoji_pattern}]"  
    text = re.sub(regex, "", text)

    text = re.sub(r"\s+", " ", text).strip()

    return text


@app.get("/")
async def root():
    return JSONResponse(content={"message": "OK"}, status_code=200)


@app.post("/classify")
async def classify_comments(youtube_url: str = Query(...)):
    video_id = get_video_id(youtube_url)
    if not video_id:
        return {"error": "Invalid YouTube URL."}

    comments = get_comments(video_id, max_comments=200)
    cleaned = [clean_text(c) for c in comments]
    X_new = vectorizer.transform(cleaned)
    y_pred = clf.predict(X_new)
    labels = encoder.inverse_transform(y_pred)

    results_df = pd.DataFrame({"comment": cleaned, "label": labels})

    grouped = {}
    for label in results_df['label'].unique():
        top_comments = results_df[results_df['label'] == label]['comment'].head(20).tolist()
        grouped[label] = top_comments

    return {
        "video_id": video_id,
        "summary": grouped
    }
