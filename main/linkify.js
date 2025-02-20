// Функция для конвертации URL в кликабельные ссылки, вставки видео и изображений
    // linkify.js


function linkify(text) {
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

    // Применяем преобразования поэтапно
    return text
        // Ссылки, изображения, YouTube, аудио и видео
        .replace(urlRegex, (url) => {
            const hyperlink = url.startsWith('http') ? url : `https://${url}`;

            if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(hyperlink)) {
                return `<img src="${hyperlink}" alt="Image" style="max-width:100%; height:auto;">`;
            }

            const youtubeMatch = hyperlink.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([^\s&]+)/);
            if (youtubeMatch && youtubeMatch[1]) {
                const videoId = youtubeMatch[1];
                return `<iframe width="300" height="200" src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>`;
            }

            if (/\.(mp4|webm|ogg)$/i.test(hyperlink)) {
                return `<video controls style="max-width:100%; height:auto;">
                            <source src="${hyperlink}" type="video/${hyperlink.split('.').pop()}">
                            Ваш браузер не поддерживает видео.
                        </video>`;
            }

            if (/\.(mp3|wav|ogg)$/i.test(hyperlink)) {
                return `<audio controls style="width:100%;">
                            <source src="${hyperlink}" type="audio/${hyperlink.split('.').pop()}">
                            Ваш браузер не поддерживает аудио.
                        </audio>`;
            }

            return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        })
        // Заголовки
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Жирный текст
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Курсив
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Списки
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>')
        // Переносы строк
        .replace(/\n/g, '<br>');
}