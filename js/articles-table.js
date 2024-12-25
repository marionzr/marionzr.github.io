(function () { // IIFE

    const app = globalThis.app;
    const sources = globalThis.sources;

    async function initTable() {
        try {
            const articles = await sources.getArticlesMetaDataAsync();
            populateTable(articles);

        } catch (error) {
            app.onError(error, 'Failed to initialize table');
            throw error;
        }
    }

    function createTableRow(article) {
        try {
            const publishedAt = new Date(article.created_at);
            const tagsList = article.tags.split(' ');

            const newRow = document.createElement('tr');

            // Article cell
            const divArticle = document.createElement('div');
            const articleCell = document.createElement('td');
            const articleTitle = document.createElement('a');
            articleTitle.addEventListener('click', navigateSafe);
            articleTitle.href = `./${article.filename}`;
            articleTitle.textContent = article.title;
            divArticle.appendChild(articleTitle);

            const articleSubtitle = document.createElement('p');
            articleSubtitle.className = "articles-table-article-subtitle"
            articleSubtitle.textContent = article.subtitle;
            divArticle.appendChild(articleSubtitle);

            articleCell.appendChild(divArticle);

            // Tags cell
            const tagsCell = document.createElement('td');
            tagsList.forEach(tag => {
                const tagLink = document.createElement('a')
                tagLink.href = `./articles.html?tag=${tag}`;
                const tagSpan = document.createElement('span');
                tagSpan.classList.add('articles-table-tag');
                tagSpan.textContent = tag;
                tagLink.appendChild(tagSpan);
                tagsCell.appendChild(tagLink);
            });

            // Date cell
            const dateCell = document.createElement('td');
            const datetime = document.createElement("date-time");
            datetime.innerText = app.formatDate(publishedAt);
            dateCell.setAttribute('data-date', publishedAt.toISOString());
            dateCell.appendChild(datetime);

            newRow.append(articleCell, tagsCell, dateCell);
            return newRow;
        } catch (error) {
            app.onError(error, 'Failed to create table row');
            return null;
        }
    }

    function populateTable(articles) {
        try {
            const tableBody = document.getElementById('articles-table-tbody');
            tableBody.innerHTML = '';

            const fragment = document.createDocumentFragment();
            articles.forEach(article => {
                const tableRow = createTableRow(article);
                if (tableRow) {
                    fragment.appendChild(tableRow);
                }
            });

            tableBody.appendChild(fragment);
        } catch (error) {
            app.onError(error, 'Failed to populate table');
        }
    }

    // ===== Filtering ============================================================

    const searchInput = document.getElementById('articles-table-search-input');
    const clearSearchInputButton = document.getElementById('articles-table-search-input-clear');

    function initTableFiltering() {
        try {
            searchInput.addEventListener("input", filter);
            clearSearchInputButton.addEventListener('click', clearFilter);
            filter();
            applyTagFiltering();
        } catch (error) {
            app.onError(error, 'Failed to initialize table filtering');
        }
    }

    function filter() {
        try {
            const filterText = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#articles-table-tbody tr');
            const totalCount = rows.length;
            let visibleCount = 0;

            clearSearchInputButton.style.display = filterText ? 'inline-block' : 'none';

            rows.forEach(row => {
                const article = row.querySelector('td:first-child a').textContent.toLowerCase();
                const tags = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const date = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

                const isVisible = [article, tags, date].some(text => text.includes(filterText));
                row.style.display = isVisible ? '' : 'none';
                if (isVisible) {
                    visibleCount++;
                }
            });

            document.getElementById('articles-table-row-count').textContent =
                `Showing ${visibleCount} of ${totalCount}`;
        } catch (error) {
            app.onError(error, 'Failed to filter table');
        }
    }

    function applyTagFiltering() {
        try {
            const tag = readQueryParameter('tag');

            if (tag != null && tag !== '') {
                searchInput.value = tag;
                filter();
            }
        } catch (error) {
            app.onError(error, 'Failed to read tag from URL');
        }
    }

    function readQueryParameter(paramName) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(paramName);
        } catch (error) {
            app.onError(error, 'Failed to read query parameter.');
            throw error;
        }
    }

    function clearFilter() {
        try {
            searchInput.value = '';
            filter();
        } catch (error) {
            app.onError(error, 'Failed to clear filter');
        }
    }

    // ===== Sorting =========================================================

    const sortElements = {
        name: {
            header: document.getElementById('articles-table-article-name'),
            ascIcon: document.getElementById('articles-table-sort-article-name-asc'),
            descIcon: document.getElementById('articles-table-sort-article-name-desc')
        },
        date: {
            header: document.getElementById('articles-table-article-created-at-date'),
            ascIcon: document.getElementById('articles-table-sort-article-created-at-date-asc'),
            descIcon: document.getElementById('articles-table-sort-article-created-at-date-desc')
        }
    };

    function initTableSorting() {
        try {
            const { name, date } = sortElements;
            [name.header, name.ascIcon, name.descIcon].forEach(el => {
                el.addEventListener('click', (event) => {
                    event.stopPropagation();
                    sortByArticle();
                })
            });

            [date.header, date.ascIcon, date.descIcon].forEach(el => {
                el.addEventListener('click', (event) => {
                    event.stopPropagation();
                    sortByDate();
                });

            });


            resetSorting(name.header);
            resetSorting(date.header);
            sortByDate();
        } catch (error) {
            app.onError(error, 'Failed to initialize table sorting');
        }
    }

    function resetSorting(th) {
        try {
            const currentSortState = th.classList.contains('asc') ?
                'asc' : (th.classList.contains('desc') ? 'desc' : null);

            sortElements.name.header.classList.remove('asc', 'desc');
            sortElements.date.header.classList.remove('asc', 'desc');

            Object.values(sortElements).forEach(({ ascIcon, descIcon }) => {
                ascIcon.style.display = 'none';
                descIcon.style.display = 'none';
            });

            return currentSortState;
        } catch (error) {
            app.onError(error, 'Failed to reset sorting');
            return null;
        }
    }

    function sortTable(th, getSortValue, currentSortState, icons) {
        try {
            const newSortState = !currentSortState || currentSortState === 'desc' ?
                'asc' : 'desc';

            const iconToShow = newSortState === 'asc' ? icons.ascIcon : icons.descIcon;
            iconToShow.style.display = 'inline-block';
            th.classList.add(newSortState);

            const tbody = document.getElementById('articles-table-tbody')
            const rows = Array.from(tbody.querySelectorAll('tr'));
            rows.sort((rowA, rowB) => {
                const valueA = getSortValue(rowA.cells[th.cellIndex]);
                const valueB = getSortValue(rowB.cells[th.cellIndex]);
                const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
                return newSortState === 'asc' ? comparison : -comparison;
            });

            rows.forEach(row => tbody.appendChild(row));
        } catch (error) {
            app.onError(error, 'Failed to sort table');
        }
    }

    function sortByArticle() {
        const th = sortElements.name.header;
        const currentSortState = resetSorting(th);
        sortTable(
            th,
            cell => cell.textContent.trim(),
            currentSortState,
            { ascIcon: sortElements.name.ascIcon, descIcon: sortElements.name.descIcon }
        );
    }

    function sortByDate(e) {
        const th = sortElements.date.header;
        const currentSortState = resetSorting(th);
        sortTable(
            th,
            cell => new Date(cell.getAttribute('data-date')),
            currentSortState,
            { ascIcon: sortElements.date.ascIcon, descIcon: sortElements.date.descIcon }
        );
    }

    // ===== Navigation ===========================================================

    function navigateSafe(event) {
        try {
            window.location.href = event.target.href;
        } catch (error) {
            app.onError(error, 'Failed to navigate');
        }
    }

    // ==== Initialization ========================================================

    async function initAsync() {
        try {
            await initTable();
            initTableFiltering();
            initTableSorting();
            applyTagFiltering();

            // Hide to prevent self-navigation
            document.getElementById('header-middle-articles-link').style.display = 'none';
        } catch (error) {
            app.onError(error, 'Failed to initialize articles page');
        }
    }

    document.addEventListener('DOMContentLoaded', async () => await initAsync());
})();