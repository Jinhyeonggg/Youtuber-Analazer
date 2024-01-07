import googleapiclient.discovery
import googleapiclient.errors
from googleapiclient.errors import HttpError
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

api_service_name = 'youtube'
api_version = "v3"
DEVELOPER_KEY = "AIzaSyDMGxuhewe8IXJVGaheEqQtt5xlxdufeeE"

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=DEVELOPER_KEY
)
    
def get_top_n_videos(n, region_code='KR'):
    request = youtube.videos().list(
        part='snippet',
        chart='mostPopular',
        regionCode=region_code,
        maxResults=n
    )

    response = request.execute()

    results = []
    
    for item in response['items']:
        snippet = item['snippet']

        results.append({"videoId": item['id'], "title": snippet['title'], "channelTitle": snippet['channelTitle'],
                        "publishedDate": snippet['publishedAt'], "tags": snippet['tags'] if snippet.get('tags') is not None else []})
    return results

def get_top_n_comments(video_id, n):
    try:
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=n
        )
        response = request.execute()

        comments = []
        for item in response['items']:
            comments.append(item['snippet']['topLevelComment']['snippet']['textDisplay'])
        return comments
    
    except HttpError as e:
        return []

def get_top_n_contents(numVideos=5, numComments=15, region_code='US'):
    topNvideos = get_top_n_videos(numVideos, region_code)
    results = []
    for video in topNvideos:
        videoId = video['videoId']
        topNcomments = get_top_n_comments(videoId, numComments)
        result = {}
        result['title'] = video['title']
        result['channelTitle'] = video['channelTitle']
        result['tags'] = video['tags']
        result['comments'] = topNcomments
        results.append(result)
    return results

app = Flask(__name__)
CORS(app)

@app.route('/get_youtube_data', methods=['GET'])
def response():
    top5contents = get_top_n_contents(region_code='KR')
    return jsonify(top5contents)
    
# @app.route('/<path:filename>')
# def static_files(filename):
#     return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True)