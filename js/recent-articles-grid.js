(function () { // IIFE

    const app = globalThis.app;
    const sources = globalThis.sources;

    const ARTICLES_TO_SHOW = 3; // Number of recent articles to display in the grid

     // ==== Load external components needed to render the grid component ===============

    const createArticleCard = (article) => {
        try {
            const card = document.createElement('div');
            card.className = 'recent-articles-grid-article-card';

            const content = document.createElement('div');
            content.className = 'recent-articles-grid-article-content';

            const dateTime = article.created_at ?
                `<date-time class="recent-articles-grid-article-date">${app.formatDate(new Date(article.created_at))}</date-time>` : '';
            content.innerHTML = `
                <a href="${article.filename}">
                <div>
                    <h2 class="recent-articles-grid-article-title">${article.title}</h2>
                    <p class="recent-articles-grid-article-subtitle">${article.subtitle}</p>
                </div>
                    ${dateTime}
                </a>`;

            card.appendChild(content);

            if (article.image) {
                const image = document.createElement('img');
                image.classList.add('recent-articles-grid-article-image');
                image.classList.add('img-no-placeholder')

                let imageSrc = article.image.replace(/^..\//, './');
                image.src = imageSrc;

                image.alt = article.title;
                image.loading = 'lazy';

                image.addEventListener('click', () => window.location.href = article.filename);
                card.appendChild(image);
            }

            return card;
        } catch (error) {
            app.onError(error, 'Error creating article card');
            return null;
        }
    };

    const initAsync = async () => {

        try {
            const gridContainer = document.getElementById('recent-articles-grid');
            gridContainer.innerHTML = '';

            const articles = await sources.getArticlesMetaDataAsync();
            const sortedArticles = [...articles].sort((a, b) => b.created_at.getTime() - a.created_at);

            sortedArticles
                .slice(0, ARTICLES_TO_SHOW)
                .forEach(article => {
                    const card = createArticleCard(article);

                    if (card) {
                        gridContainer.appendChild(card);
                    }
                });

            const previousArticlesCard = createArticleCard({
                title: " Previous articles " + '<i class="far fa-newspaper fa-lg"></i>',
                subtitle: "I'm turning my ideas into bite-sized articles – stay tuned for more!<p><small>In the meantime, check out my previous articles.<small></p>",
                date: articles.created_at,
                filename: "./articles.html"
            });

            if (previousArticlesCard) {
                previousArticlesCard.classList.add('recent-articles-grid-previous-articles-card');
                gridContainer.appendChild(previousArticlesCard);
            }

        } catch (error) {
            app.onError(error, 'Failed to load article posts');
            gridContainer.innerHTML = `
                <div class="recent-articles-grid-error-message">
                    Failed to load recent articles. Please access the articles table <i class="far fa-newspaper fa-lg"></i> in the toolbar.
                </div>
            `;
        }
    };

    document.addEventListener('DOMContentLoaded', async () => await initAsync());
})();