document.addEventListener("DOMContentLoaded", async () => {
    const postFiles = ["https://berlandbor.github.io/BlogBerlandbor-/posts/1.txt", "posts/post2.txt"]; // Список файлов
    const container = document.getElementById("blog");

    for (const file of postFiles) {
        try {
            console.log("Загружаем:", file); // Лог в консоли для отладки
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Ошибка загрузки: ${file}`);
            const text = await response.text();

            const lines = text.split("\n");
            if (lines.length < 2) throw new Error(`Файл ${file} имеет неправильный формат`);

            const title = lines[0].trim();
            const date = lines[1].trim();
            const content = lines.slice(2).join("\n");

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
            console.error(error);
        }
    }
});
