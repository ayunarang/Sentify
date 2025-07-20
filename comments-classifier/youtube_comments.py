from googleapiclient.discovery import build
import html
import re
from urllib.parse import urlparse, parse_qs
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")


def get_video_id(youtube_url: str) -> str:
    parsed_url = urlparse(youtube_url)
    query = parse_qs(parsed_url.query)
    
    if "v" in query:
        return query["v"][0]
    
    if "youtu.be" in parsed_url.netloc:
        return parsed_url.path.lstrip('/')

    match = re.search(r"/(?:embed|shorts|v)/([a-zA-Z0-9_-]{11})", parsed_url.path)
    if match:
        return match.group(1)
    
    match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})", youtube_url)
    return match.group(1) if match else None



def get_comments(video_id, max_comments=200):
    youtube = build('youtube', 'v3', developerKey=API_KEY)
    comments = []
    seen_comments = set()

    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=100
    )
    response = request.execute()

    while response is not None:
        for item in response["items"]:
            display_comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            clean_comment = html.unescape(display_comment).strip()

            # Avoid duplicates
            if clean_comment not in seen_comments:
                seen_comments.add(clean_comment)
                comments.append(clean_comment)

                if len(comments) >= max_comments:
                    return comments

        if 'nextPageToken' in response:
            request = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                pageToken=response['nextPageToken']
            )
            response = request.execute()
        else:
            break

    return comments
