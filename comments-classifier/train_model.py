import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import re
import joblib



df = pd.read_csv("comments_labelled.csv")


df["label"] = (
    df["label"]
    .astype(str)
    .str.strip()
    .str.replace('"', '')
    .str.replace("'", '')
)

print("Unique labels:", df["label"].unique())



KEEP_EMOJIS = [
    "😂", "🤣", "💀", "🤡", 
    "🙂", "😊", "😀", "😃", "😄", "😁", "😆", "😍", "❤️", 
    "💰", "💸", "🤑"         
]

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text) 
    emoji_pattern = "".join(KEEP_EMOJIS)
    regex = rf"[^a-zA-Z\s{emoji_pattern}]"
    text = re.sub(regex, "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

df['comment'] = df['comment'].apply(clean_text)



encoder = LabelEncoder()
y = encoder.fit_transform(df["label"])

vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 3),
    min_df=2,
    max_df=0.9
)

X = vectorizer.fit_transform(df["comment"])



X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y
)



clf = LogisticRegression(max_iter=1000, class_weight="balanced")
clf.fit(X_train, y_train)


y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("accuracy", accuracy)

print("classification_report")
print(classification_report(y_test, y_pred, target_names=encoder.classes_))

print("Label counts:\n", df["label"].value_counts())

scores = cross_val_score(clf, X, y, cv=5)
print(f"Cross-validated accuracy: {scores.mean():.3f} (+/- {scores.std():.3f})")



joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(clf, "classifier.pkl")
joblib.dump(encoder, "label_encoder.pkl")


