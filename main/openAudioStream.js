document.addEventListener("DOMContentLoaded", function () {
    console.log("streamHandler.js загружен!");

    function openStream(url) {
        console.log("Открытие потока:", url);
        let a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    document.addEventListener("click", function (event) {
        const audioElement = event.target.closest(".inactive-audio");
        if (audioElement) {
            const streamUrl = audioElement.getAttribute("data-stream-url");
            if (streamUrl) {
                console.log("Клик по неактивному плееру, открываем:", streamUrl);
                openStream(streamUrl);
            } else {
                console.warn("У плеера нет data-stream-url!");
            }
        }
    });
});