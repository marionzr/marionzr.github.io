(function () { // IIFE

    const sources = {};
    globalThis.sources = sources;

    const app = globalThis.app;

    const articlesMetadata = `https://raw.githubusercontent.com/${app.USERNAME}/marionzr.github.io/refs/heads/sources/articles-metadata.csv?${getHourlyCacheKey()}&v=${app.VERSION}`;

    function getHourlyCacheKey() {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');

            return `cache_bust=${year}${month}${day}${hour}`;
        } catch (error) {
            app.onError(error, 'Failed to generate cache key.');
            throw error;
        }
    }

    async function getArticleMetadataCsvAsync() {
        // Try to load local override file first, before any other checks
        try {

            const localArticlesMetadataCsv = globalThis.sourceslocal?.localArticlesMetadataCsv;

            if (localArticlesMetadataCsv != null &&
                localArticlesMetadataCsv != '') {

                console.info('📄 Using local in-memory articles-metadata.csv data');

                return localArticlesMetadataCsv;
            }
        } catch(error) {
            app.onError(error, 'Failed to load in-memory articles-metadata');
            // No need to handle this as it's pure local-dev feature.
        }

        // If no override file, check storage cache
        const csvContentFromStorage = app.getItem(articlesMetadata);

        if (csvContentFromStorage !== null && csvContentFromStorage !== '') {
            return csvContentFromStorage;
        }

        // Clean up old storage entries
        for (let i = 0; i < localStorage.length; i++) {

            const key = localStorage.key(i);

            if (key.indexOf("githubusercontent") > -1) {
                localStorage.removeItem(key);
            }
        }

        // Fall back to remote file if no override or cache exists
        console.info('🛜 Downloading ArticlesCsv from the internet');
        const response = await fetch(articlesMetadata);
        const csvContent = await response.text();
        app.setItem(articlesMetadata, csvContent);

        return csvContent;
    }

    async function getArticlesMetadataAsync() {

        const csvContent = await getArticleMetadataCsvAsync();
        const rows = csvContent
            .split("\n")
            .filter(row => row.trim() !== '');  // Filter out any empty rows
        const articleMetadataArray = [];

        // Start parsing the rows (skip header)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();

            if (row === "") {
                continue;
            }

            const values = row.split(";");
            const [filename, title, subtitle, image, tags, created_at, last_updated_at] = values;

            // Create a new Row object
            const articleMetadata = new ArticleMetadata(
                filename.trim(),
                title.trim(),
                subtitle.trim(),
                image.trim(),
                tags.trim(),
                app.parseDate(created_at.trim()),
                last_updated_at?.trim() || ''  // last_updated_at can be empty
            );

            articleMetadataArray.push(articleMetadata);
        }

        return articleMetadataArray;
    }

    // Row Object definition
    class ArticleMetadata {
        constructor(filename, title, subtitle, image, tags, created_at, last_updated_at) {
            this.filename = filename;
            this.title = title;
            this.subtitle = subtitle;
            this.image = image;
            this.tags = tags;
            this.created_at = created_at;
            this.last_updated_at = last_updated_at || null; // last_updated_at is optional
        }
    }

    sources.getArticlesMetaDataAsync = getArticlesMetadataAsync;
})();