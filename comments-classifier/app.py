from fastapi import FastAPI, Query
import joblib
import pandas as pd
import re
import html
from fastapi.middleware.cors import CORSMiddleware
from youtube_comments import get_video_id, get_comments
from fastapi.responses import JSONResponse
from sklearn.exceptions import NotFittedError

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sentify-topaz.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
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

    try:
        X_new = vectorizer.transform(cleaned)
        y_pred = clf.predict(X_new)
        y_proba = clf.predict_proba(X_new)
    except NotFittedError:
        return {"error": "Classifier or vectorizer not fitted."}

    confidence_scores = y_proba.max(axis=1)
    predicted_labels = encoder.inverse_transform(y_pred)

    results_df = pd.DataFrame({
        "comment": cleaned,
        "label": predicted_labels,
        "confidence": confidence_scores
    })

    label_counts = results_df["label"].value_counts().to_dict()

    top_5_by_label = (
        results_df
        .sort_values(by="confidence", ascending=False)
        .groupby("label")
        .head(5)
    )

    grouped = top_5_by_label.groupby("label")["comment"].apply(list).to_dict()

    response = {
        "video_id": video_id,
        "summary": grouped,
        "label_counts": label_counts
    }

    return response
