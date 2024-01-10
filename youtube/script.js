async function showNews() {
    document.getElementById("showNews").disabled = true;
    const newsContainer = document.getElementById('news-container');

    var newsBoxes = document.querySelectorAll('.news-box');
    newsBoxes.forEach(function (newsBox) {
        newsBox.remove();
    });

    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.style.display = 'inline';

    const baseUrl = 'https://port-0-flask-1fk9002blr3j4h63.sel5.cloudtype.app/';
    const params = {
        key1: 1,
        key2: 4,
    };
    const urlWithParams = new URL(baseUrl);
    urlWithParams.search = new URLSearchParams(params).toString();
    const response = await fetch(urlWithParams);
    const datas = await response.json();



    datas.forEach(data => {
        const title = data.title;
        const channelTitle = data.channelTitle;
        const comments = data.comments;
        const tags = data.tags;
        const hyperlink = data.hyperlink;
        console.log(hyperlink)
        console.log(comments);
        const template = document.createElement('div');
        template.className = 'news-box';
        template.innerHTML = `
            <a href="#" id="linkButton${hyperlink}" class="title">${title}</a>
            <div class="channelTitle">Channel: ${channelTitle}</div>
            <ul class="comments">
                ${comments.map(comment => `<li>${comment}</li>`).join('')}
            </ul>
        `;
        newsContainer.appendChild(template);

        document.getElementById('linkButton'.concat('', hyperlink)).addEventListener('click', function () {
            this.href = hyperlink;
        });
    })

    loadingMessage.style.display = 'none';
    document.getElementById('showNews').textContent = 'Update!';

    document.getElementById("showNews").disabled = false;
}