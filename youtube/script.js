// var baseUrl = 'http://127.0.0.1:5000/';
var baseUrl = 'https://port-0-flask-1fk9002blr3j4h63.sel5.cloudtype.app/' 

async function showNews() {
    document.getElementById("showNews").disabled = true;
    document.getElementById("showNews").innerText = "Loading..."
    const newsContainer = document.getElementById('news-container');

    var newsBoxes = document.querySelectorAll('.news-box');
    newsBoxes.forEach(function (newsBox) {
        newsBox.remove();
    });

    // const loadingMessage = document.getElementById('loading-message');
    // loadingMessage.style.display = 'inline';

    var category = document.getElementById('categoryButton').innerText;

    const params = {
        category: category
    };
    const urlWithParams = new URL(baseUrl);
    urlWithParams.search = new URLSearchParams(params).toString();
    const response = await fetch(urlWithParams);
    const datas = await response.json();


    datas.forEach(data => {
        const videoId = data.videoId;
        const title = data.title;
        const channelTitle = data.channelTitle;
        const comments = data.comments;
        const tags = data.tags;
        const hyperlink = data.hyperlink;
        const channelId = data.channelId;
        
        const thumbnailURL = data.thumbnailURL;

        const template = document.createElement('div');
        template.className = 'news-box';
        template.setAttribute('id', videoId);
        template.innerHTML = `
            <a href="#" id="${videoId}" class="title">${title}</a>
            <div class="thumbnailNchannelNcomments">
                <div class="thumbnailNchannel">
                    <img class="thumbnail" src=${thumbnailURL}>
                    <div class="channelTitle">Channel: ${channelTitle}</div>
                    <button id="info${videoId}" onclick="info('${videoId}')">요약해다오</button>
                    <button id="opinion${channelId}" onclick="opinion('${videoId}', '${channelId}')">이 유튜버 여론 좀 알려다오..</button>
                </div>
                <ul class="comments">
                    ${comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
            </div>
        `;
        newsContainer.appendChild(template);

        document.getElementById(videoId).addEventListener('click', function () {
            this.href = hyperlink;
        });
    })

    // loadingMessage.style.display = 'none';
    document.getElementById("showNews").innerText = "Update!"

    document.getElementById("showNews").disabled = false;
}

function changeCategory(category) {
    document.getElementById('categoryButton').innerText = 'category: '.concat(category);
}

async function info(videoId) {
    document.getElementById(`info${videoId}`).textContent = "로딩중...\n10초 이상 소요되니 기다려주세요.";
    document.getElementById(`info${videoId}`).disabled = true;

    const params = {
        videoId: videoId,
        requestType: 'summary',
    };
    const urlWithParams = new URL(baseUrl.concat('info'));
    urlWithParams.search = new URLSearchParams(params).toString();
    
    const response = await fetch(urlWithParams);
    const data = await response.json();
    console.log(data.response);

    document.getElementById(videoId).querySelector('.comments').innerText = data.response;
    document.getElementById(`info${videoId}`).disabled = false;
    document.getElementById(`info${videoId}`).textContent = "요약해다오"
}

async function opinion(videoId, channelId) {
    document.getElementById(`opinion${channelId}`).textContent = "로딩중...\n10초 이상 소요되니 기다려주세요.";
    document.getElementById(`opinion${channelId}`).disabled = true;
    
    url = baseUrl.concat('info');

    const params = {
        requestType: 'opinion',
        channelType: 'channelId',
        channelId: channelId,
        search: 'none',
    };
    const urlWithParams = new URL(url);
    urlWithParams.search = new URLSearchParams(params).toString();
    const response = await fetch(urlWithParams);
    const data = await response.json();
    console.log(data.response);

    document.getElementById(videoId).querySelector('.comments').innerText = data.response;
    document.getElementById(`opinion${channelId}`).disabled = false;
    document.getElementById(`opinion${channelId}`).textContent = "이 유튜버 여론 좀 알려다오.."
}

// async function init(videoId, comments) {
//     document.getElementById(videoId).querySelector('.comments').innerHTML = `
//         <ul class="comments">
//             ${comments.map(comment => `<li>${comment}</li>`).join('')}
//         </ul>
//     `;
//     document.getElementById(`init${videoId}`).disabled = false;
//     document.getElementById(`init${videoId}`).textContent = "초기화해다오"
// }