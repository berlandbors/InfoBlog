document.addEventListener("DOMContentLoaded", async () => {
    const postFiles = [
        "posts/1.txt",
        "posts/2.txt",
        "posts/3.txt",
        "posts/4.txt"
    ]; // Список статей

    const postsPerPage = 1; // Количество статей на странице
    let currentPage = 1;
    let allPosts = []; // Хранит загруженные статьи

    const blogContainer = document.getElementById("blog");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const pageNumber = document.getElementById("pageNumber");
    const searchInput = document.getElementById("searchInput");

    // Функция загрузки статей в массив
    async function loadAllPosts() {
        allPosts = []; // Очистка перед загрузкой
        for (const file of postFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Ошибка загрузки: ${file}`);
                const text = await response.text();

                const lines = text.split("\n");
                const title = lines[0].trim();
                const date = lines[1].trim();
                const content = lines.slice(2).join("\n");

                allPosts.push({ title, date, content, file });
            } catch (error) {
                console.error(error);
            }
        }
        displayPosts(); // Отображаем статьи после загрузки
    }

    // Функция для автоформатирования Markdown-подобного текста в HTML
    function formatText(text) {
        return text
            .replace(/^### (.*$)/gim, "<h3>$1</h3>") // Заголовки 3 уровня
            .replace(/^## (.*$)/gim, "<h2>$1</h2>") // Заголовки 2 уровня
            .replace(/^# (.*$)/gim, "<h1>$1</h1>") // Заголовки 1 уровня
            .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>") // Жирный текст
            .replace(/\*(.*?)\*/gim, "<i>$1</i>") // Курсив
            .replace(/`([^`]+)`/gim, "<code>$1</code>") // Код (одна строка)
            .replace(/- (.*)/gim, "<ul><li>$1</li></ul>") // Списки
            .replace(/\n/g, "<br>"); // Перенос строк
    }

    // Функция отображения статей (учитывает пагинацию и поиск)
    function displayPosts() {
        blogContainer.innerHTML = ""; // Очищаем старые статьи

        const searchQuery = searchInput.value.toLowerCase(); // Запрос поиска
        const filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery) ||
            post.content.toLowerCase().includes(searchQuery)
        ); // Оставляем только совпадающие статьи

        const totalPages = Math.ceil(filteredPosts.length / postsPerPage); // Вычисляем кол-во страниц
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const pagePosts = filteredPosts.slice(startIndex, endIndex); // Отображаем нужные статьи

        for (const post of pagePosts) {
            const article = document.createElement("div");
            article.classList.add("post");
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p><small>${post.date}</small></p>
                <p>${formatText(post.content)}</p>
                <hr>
            `;
            blogContainer.appendChild(article);
        }

        // Обновляем состояние кнопок
        pageNumber.textContent = `Страница ${currentPage}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= totalPages;
    }

    // Функция поиска
    function searchPosts() {
        currentPage = 1; // Сбрасываем страницу
        displayPosts(); // Перерисовываем статьи
    }

    // Обработчики кнопок
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayPosts();
        }
    });

    nextButton.addEventListener("click", () => {
        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayPosts();
        }
    });

    // Загружаем статьи при запуске
    loadAllPosts();
    window.searchPosts = searchPosts; // Делаем функцию доступной в `oninput`
});