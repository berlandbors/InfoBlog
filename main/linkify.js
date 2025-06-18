function linkify(text) {
    // Регулярка захватывает URL, но не включает "хвостовые" символы: ) ] } > . , ; : ! ? " ' <
    const urlRegex = /((https?:\/\/|www\.)[^\s\)\]\}\>\.,;:!?"'<]+)/g;
    
    return text.replace(urlRegex, (url) => {
        // Проверяем, не осталось ли всё же "хвостовых" символов на конце (например, скобка внутри ссылки)
        let cleanUrl = url;
        let tail = '';
        // Если вдруг ссылка заканчивается на разрешённый "хвост", убираем его из ссылки и добавим после <a>
        const match = url.match(/^(.+?)([)\]\}\>\.,;:!?"'<]+)?$/);
        if (match) {
            cleanUrl = match[1];
            tail = match[2] || '';
        }
        const hyperlink = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
        return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${hyperlink}</a>${tail}`;
    })
    // Обработка Markdown-разметки
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Нумерованные списки
    .replace(/(^\s*\d+\.\s+.+(?:\n|$))/gm, (match) => {
        const items = match.trim().split('\n').map(item => {
            return item.replace(/^\s*\d+\.\s+(.+)$/, '<li>$1</li>');
        }).join('');
        return `<ul>${items}</ul>`;
    })
    // Маркированные списки
    .replace(/(^- .+(?:\n- .+)*)/gm, (match) => {
        const items = match.split('\n').map(item => item.replace(/^- (.+)$/, '<li>$1</li>')).join('');
        return `<ul>${items}</ul>`;
    })
    // **Жирный** текст
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // *Курсив*
    .replace(/(^|[^*])\*(?!\s)(.+?)(?!\s)\*(?!\*)/g, '$1<em>$2</em>')
    // ***Жирный курсив***
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // _Подчеркнутый текст_
    .replace(/\+\+(.+?)\+\+/g, '<u>$1</u>')
    .replace(/~~(.+?)~~/g, '<u>$1</u>')
    // Кодовые блоки и строки
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Переносы строк
    .replace(/\n/g, '<br>');
}