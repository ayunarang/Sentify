from googleapiclient.discovery import build
import html

from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")


def get_video_id(youtube_url: str) -> str:

    import re
    pattern = r"(?:v=|youtu\.be/)([^&]+)"
    match = re.search(pattern, youtube_url)
    return match.group(1) if match else None


def get_comments(video_id, max_comments=200):

    youtube = build('youtube', 'v3', developerKey=API_KEY)
    comments = []
    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=100
    )
    response = request.execute()

    while response is not None:
        for item in response["items"]:
            display_comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            
            clean_comment = html.unescape(display_comment) 
            
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
        else:
            break
    return comments