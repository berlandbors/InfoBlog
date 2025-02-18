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
    const tocContainer = document.getElementById("toc");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const pageNumber = document.getElementById("pageNumber");
    const searchInput = document.getElementById("searchInput");

    // Функция транслитерации заголовков в латиницу
    function transliterate(text) {
        const ruToEn = {
            "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "zh", "з": "z",
            "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r",
            "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch",
            "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya"
        };
        return text.toLowerCase()
            .replace(/[а-яё]/g, char => ruToEn[char] || char)
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    }

    // Функция загрузки статей
    async function loadAllPosts() {
        allPosts = [];
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
        generateTOC();
        checkURLForArticle();
        displayPosts();
    }

    // Функция создания оглавления
    function generateTOC() {
        tocContainer.innerHTML = "<ul>";

        allPosts.forEach((post, index) => {
            const postSlug = transliterate(post.title);
            tocContainer.innerHTML += `<li><a href="?article=${index}&title=${postSlug}">${post.title}</a></li>`;
        });

        tocContainer.innerHTML += "</ul>";
    }

    // Функция прокрутки вверх
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Функция отображения статей
    function displayPosts() {
        blogContainer.innerHTML = "";

        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const pagePosts = allPosts.slice(startIndex, endIndex);

        for (let i = 0; i < pagePosts.length; i++) {
            const post = pagePosts[i];
            const postSlug = transliterate(post.title);
            const article = document.createElement("div");
            article.classList.add("post");
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p><small>${post.date}</small></p>
                <p>${post.content.replace(/\n/g, "<br>")}</p>
                <p>
                    <button class="copy-link" data-link="?article=${startIndex}&title=${postSlug}">🔗 Скопировать ссылку</button>
                    <button class="share-link" data-link="?article=${startIndex}&title=${postSlug}">📤 Поделиться</button>
                </p>
                <hr>
            `;
            blogContainer.appendChild(article);
        }

        // Обновляем состояние кнопок пагинации
        pageNumber.textContent = `Страница ${currentPage}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= totalPages;

        // Добавляем обработчики кнопок копирования и отправки
        document.querySelectorAll(".copy-link").forEach(button => {
            button.addEventListener("click", (event) => {
                const url = window.location.origin + window.location.pathname + event.target.getAttribute("data-link");
                navigator.clipboard.writeText(url).then(() => {
                    alert("Ссылка скопирована!");
                }).catch(err => {
                    console.error("Ошибка при копировании ссылки", err);
                });
            });
        });

        document.querySelectorAll(".share-link").forEach(button => {
            button.addEventListener("click", (event) => {
                const url = window.location.origin + window.location.pathname + event.target.getAttribute("data-link");
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        url: url
                    }).catch(err => console.error("Ошибка при отправке", err));
                } else {
                    alert("Ваш браузер не поддерживает функцию 'Поделиться'. Просто скопируйте ссылку.");
                }
            });
        });

        scrollToTop();
    }

    // Функция проверки URL
    function checkURLForArticle() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("article")) {
            const articleIndex = parseInt(params.get("article"));
            if (!isNaN(articleIndex) && articleIndex >= 0 && articleIndex < allPosts.length) {
                currentPage = articleIndex + 1;
                displayPosts();
                document.title = params.get("title").replace(/-/g, " ");
            }
        }
    }

    // Обработчики кнопок пагинации
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
});