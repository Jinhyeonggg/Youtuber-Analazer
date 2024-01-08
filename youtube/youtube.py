import googleapiclient.discovery
import googleapiclient.errors
from googleapiclient.errors import HttpError
from flask import Flask, jsonify, request
from flask_cors import CORS
import random

api_service_name = 'youtube'
api_version = "v3"
DEVELOPER_KEY = "AIzaSyDMGxuhewe8IXJVGaheEqQtt5xlxdufeeE"

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=DEVELOPER_KEY
)
    
def get_top_n_videos(numVidoes, region_code='KR'):
    request = youtube.videos().list(
        part='snippet',
        chart='mostPopular',
        regionCode=region_code,
        maxResults=100
    )

    response = request.execute()
    print(len(response['items']))
    results = []
    randomList = random.sample(range(0, 100), numVidoes)
    print(randomList)
    for idx, item in enumerate(response['items']):
        if idx not in randomList:
            continue
        snippet = item['snippet']

        print(snippet['title'])
        results.append({"videoId": item['id'], "title": snippet['title'], "channelTitle": snippet['channelTitle'],
                        "publishedDate": snippet['publishedAt'], "tags": snippet['tags'] if snippet.get('tags') is not None else []})
    return results

def get_top_n_comments(video_id, numComments):
    try:
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=numComments
        )
        response = request.execute()

        comments = []
        for item in response['items']:
            comments.append(item['snippet']['topLevelComment']['snippet']['textDisplay'])
        return comments
    
    except HttpError as e:
        return []

def get_top_n_contents(numVideos, numComments, region_code='US'):
    topNvideos = get_top_n_videos(numVideos, region_code)
    results = []
    for video in topNvideos:
        videoId = video['videoId']
        topNcomments = get_top_n_comments(videoId, numComments)
        results.append({
            'title': video['title'],
            'channelTitle': video['channelTitle'],
            'tags': video['tags'],
            'comments': topNcomments,
            'hyperlink': "https://www.youtube.com/watch?v=" + videoId
        })
    return results

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def response():
    # a = request.args.get('key1')
    # print(a)
    top5contents = get_top_n_contents(numVideos=10, numComments=15, region_code='KR')
    return jsonify(top5contents)


# CORS(app)
# @app.route('/test', methods=['POST'])
# def respons():
#     a = request.get_json()
#     print("===============================")
#     print(a['message'])
#     print("===============================")
#     return jsonify("here is response!")

app.run(debug=True)