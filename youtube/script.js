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

    // const baseUrl = 'http://127.0.0.1:5000';
    const baseUrl = 'https://port-0-flask-1fk9002blr3j4h63.sel5.cloudtype.app/' 

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
                    <button id="info${videoId}" onclick="info('${videoId}')">요약해줘!</button>
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
    document.getElementById(`info${videoId}`).textContent = "로딩중...";
    document.getElementById(`info${videoId}`).disabled = true;
    // const baseUrl = 'http://127.0.0.1:5000/info' 
    const baseUrl = 'https://port-0-flask-1fk9002blr3j4h63.sel5.cloudtype.app/info' 

    const params = {
        videoId: videoId,
        requestType: 'summary',
    };
    const urlWithParams = new URL(baseUrl);
    urlWithParams.search = new URLSearchParams(params).toString();
    const response = await fetch(urlWithParams);
    const data = await response.json();
    console.log(data.response);

    document.getElementById(videoId).querySelector('.comments').innerText = data.response;
    document.getElementById(`info${videoId}`).disabled = false;
    document.getElementById(`info${videoId}`).textContent = "요약해줘!"
}