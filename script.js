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
    const tocContainer = document.getElementById("toc"); // Контейнер оглавления
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
        generateTOC(); // Обновляем оглавление
        checkURLForArticle(); // Проверяем URL и загружаем нужную статью
        displayPosts(); // Отображаем статьи после загрузки
    }

    // Функция создания динамического оглавления
    function generateTOC() {
        tocContainer.innerHTML = "<ul>";

        allPosts.forEach((post, index) => {
            const postId = `post-${index}`; // Уникальный ID для статьи
            tocContainer.innerHTML += `<li><a href="?article=${index}">${post.title}</a></li>`;
        });

        tocContainer.innerHTML += "</ul>";
    }

    // Функция прокрутки вверх при переключении страниц
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
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

        for (let i = 0; i < pagePosts.length; i++) {
            const post = pagePosts[i];
            const articleId = `post-${i}`;
            const article = document.createElement("div");
            article.classList.add("post");
            article.id = articleId;
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p><small>${post.date}</small></p>
                <p>${post.content.replace(/\n/g, "<br>")}</p>
                <p><a href="?article=${i}" class="share-link">🔗 Ссылка на статью</a></p>
                <hr>
            `;
            blogContainer.appendChild(article);
        }

        // Обновляем состояние кнопок
        pageNumber.textContent = `Страница ${currentPage}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= totalPages;

        // Прокрутка вверх при смене страницы
        scrollToTop();
    }

    // Функция проверки URL на наличие статьи
    function checkURLForArticle() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("article")) {
            const articleIndex = parseInt(params.get("article"));
            if (!isNaN(articleIndex) && articleIndex >= 0 && articleIndex < allPosts.length) {
                currentPage = articleIndex + 1;
                displayPosts();
            }
        }
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