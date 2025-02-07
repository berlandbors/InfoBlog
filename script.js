document.getElementById("loadPosts").addEventListener("click", async () => {
    const postFiles = ["posts/1.txt", ""]; // Список файлов
    const container = document.getElementById("blog");

    for (const file of postFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error("Ошибка загрузки: " + file);
            const text = await response.text();

            const lines = text.split("\n"); // Разбиваем по строкам
            const title = lines[0];         // Первая строка — заголовок
            const date = lines[1];          // Вторая строка — дата
            const content = lines.slice(2).join("\n"); // Остальной текст

            const article = document.createElement("div");
            article.classList.add("post");
            article.innerHTML = `
                <h2>${title}</h2>
                <p><small>${date}</small></p>
                <p>${content}</p>
                <hr>
            `;
            container.appendChild(article);
        } catch (error) {
            console.error("Ошибка загрузки статьи:", error);
        }
    }
});
