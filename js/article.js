(function () { // IIFE

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

    function init() {
        checkMissingInformation();
    }

    document.addEventListener('DOMContentLoaded', init);
})();

function getHomeLink() {
    return '../index.html';
}

function getArticlesLink() {
    return './articles.html';
}