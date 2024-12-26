(function () { // IIFE

    const app = globalThis.app;
    const header = globalThis.header;

    function checkMissingInformation() {
        try {
            const documentTitle = document.title;
            const suffix = " | marionzr";

            if (!documentTitle?.trim()) {
                alert("Title is empty");
            } else if (!documentTitle.endsWith(suffix)) {
                alert("Title has no suffix");
            }

            const articleHeader = document.querySelector('article-header');
            const articleTitle = articleHeader.querySelector('#article-header-title');
            const trimmedDocumentTitle = documentTitle.replace(suffix, '').trim();
            const title = articleTitle.textContent?.trim();

            if (title !== trimmedDocumentTitle) {
                alert("<h1> inside <article-header> does not match <title>");
            }

            const articleSubtitle = articleHeader.querySelector('#article-header-subtitle');

            if (!articleSubtitle?.textContent || articleSubtitle.textContent.trim() === '') {
                alert("<h2> subtitle is empty");
            }

            const tagsElement = articleHeader.querySelector('article-tags');

            if (!tagsElement?.textContent?.trim()) {
                alert("<tags> element is empty");
            }
        } catch (error) {
            app.onError(error, 'Error in checkMissingInformation');
        }
    }

    function getCurrentFileName() {
        const path = window.location.pathname;
        return getFileName(path);
    }

    function getFileName(fullFilename) {
        return fullFilename.substring(fullFilename.lastIndexOf('/') + 1);
    }

    async function loadCreatedAtDateTime() {
        try {
            const dateElement = document.getElementById('article-header-info-matadata-created-at');

            const filename = getCurrentFileName();
            const articles = await sources.getArticlesMetaDataAsync();

            if (!articles) {
                console.warn('No articles returned');
                return;
            }

            const currentArticle = articles.find(a => getFileName(a.filename) == filename);

            if (!currentArticle) {
                console.warn(`No metadata found for article '${filename}'`);
                return
            }
            const createdAt = app.formatDate(new Date(currentArticle.created_at));
            dateElement.textContent = createdAt;
        } catch (error) {
            app.onError(error, 'Error in setArticlePublishDate');
        }
    }

    function initPageWidthControl() {
        try {
            const headerRight = document.getElementById('header-right');
            const pageExpandToggle = document.createElement('button');
            pageExpandToggle.id = 'header-right-page-expand-toggle';

            const pageExpandToggleIcon = document.createElement('i');
            pageExpandToggle.appendChild(pageExpandToggleIcon);

            headerRight.insertBefore(pageExpandToggle, headerRight.lastChild);

            //headerRight.insertAdjacentElement('afterend', pageExpandToggle);


            pageExpandToggleIcon.addEventListener('click', togglePageWidth);
            const mql = window.matchMedia('(max-width: 768px)');

            if (mql.matches) {
                pageExpandToggleIcon.style.display = 'none';
                main.className = 'main-expanded';
            } else {
                const mainExpanded = app.getItem('main-expanded') === 'true';
                pageExpandToggleIcon.style.display = '';

                main.className = mainExpanded ? 'main-expanded' : 'main-normal';
                pageExpandToggleIcon.className = mainExpanded ? 'fa fa-expand' : 'fa fa-compress';
            }

            const mediaQuery = window.matchMedia('(max-width: 768px)'); // Mobile view
            mediaQuery.addEventListener('change', handleMediaQueryChange.bind(null, pageExpandToggleIcon));
        } catch (error) {
            app.onError(error, 'Error in initializePageWidthControl');
        }
    }

    function togglePageWidth() {
        try {
            const main = document.querySelector('main');
            const pageWidthIcon = document.querySelector('#header-right-page-expand-toggle i');
            const isExpanded = main.className === 'main-expanded';

            pageWidthIcon.className = isExpanded ? 'fa fa-compress' : 'fa fa-expand';
            main.className = isExpanded ? 'main-normal' : 'main-expanded';
            app.setItem('main-expanded', !isExpanded);
        } catch (error) {
            app.onError(error, 'Error in togglePageWidth');
        }
    }

    function handleMediaQueryChange(pageExpandToggleIcon, e) {
        try {
            if (e.matches) {
                pageExpandToggleIcon.style.display = 'none';
                main.className = 'main-expanded';
            } else {
                pageExpandToggleIcon.style.display = '';
                const mainExpanded = app.getItem('main-expanded') === 'true';
                main.className = mainExpanded ? 'main-expanded' : 'main-normal';
                pageExpandToggleIcon.className = mainExpanded ? 'fa fa-expand' : 'fa fa-compress';
            }
        } catch (error) {
            app.onError(error, 'Error in handleMediaQueryChange');
        }
    }

    function initReadingMode() {
        const currentContentMode = document.documentElement.getAttribute('reading-mode');
        header.showHideImages(currentContentMode === 'text-only');
    }

    async function init() {
        checkMissingInformation();
        await loadCreatedAtDateTime();
        initPageWidthControl();
        initReadingMode();
    }

    document.addEventListener('DOMContentLoaded', () => init());
})();

function getHomeLink() {
    return '../index.html';
}

function getArticlesLink() {
    return './articles.html';
}