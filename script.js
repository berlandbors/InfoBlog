document.addEventListener("DOMContentLoaded", async () => {
    const postFiles = [
        "posts/1.txt",
        "posts/",
        "posts/",
        "posts/"
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

    // Функция отображения статей (учитывает пагинацию и поиск)
    function displayPosts() {
        blogContainer.innerHTML = ""; // Очищаем старые статьи

        const searchQuery = searchInput.value.toLowerCase(); // Запрос поиска
        const filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery) ||
            post.content.toLowerCase().includes(searchQuery)
        ); // Оставляем только совпадающие статьи

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const pagePosts = filteredPosts.slice(startIndex, endIndex); // Отображаем нужные статьи

        for (const post of pagePosts) {
            const article = document.createElement("div");
            article.classList.add("post");
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p><small>${post.date}</small></p>
                <p>${post.content}</p>
                <hr>
            `;
            blogContainer.appendChild(article);
        }

        // Обновляем состояние кнопок (исправлено)
        pageNumber.textContent = `Страница ${currentPage}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = endIndex >= filteredPosts.length;
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