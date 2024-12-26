(function () { // IIFE

    const app = globalThis.app;

    function init() {
        try {
            const tagsElement = document.querySelector("article article-tags");

            if (!tagsElement) {
                return;
            }

            const words = tagsElement.textContent.trim().split(/\s+/);
            const tagContainer = document.createElement("ul");
            tagContainer.classList.add('tag-container');

            words.forEach(word => {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.href = `../articles.html?tag=${encodeURIComponent(word)}`;
                link.textContent = word;
                li.appendChild(link);
                li.className = 'tag-container-tag';
                tagContainer.appendChild(li);
            });
            tagsElement.insertAdjacentElement('afterend', tagContainer)
            tagsElement.style.display = "none";
        } catch (error) {
            app.onError(error, 'Failed to initialize tag container.');
            throw error;
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();