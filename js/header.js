(function () { // IIFE

    const app = globalThis.app;

    const URLS = {
        LINKEDIN: 'https://www.linkedin.com/in/marionzr',
        GITHUB: 'https://www.github.com/marionzr',
        AVATAR: 'https://res.cloudinary.com/dmntlbbdt/image/upload/c_scale,w_150/v1739445768/qilf5bbo6k8vhwjva2st',
    };

    const FONT_SIZES = {
        MIN: 12,
        MAX: 24,
        DEFAULT: 16,
        STEP: 2
    };

    const USERNAME = 'marionzr';
    const AVATAR_IMG_ID = 'avatar-img';

    function init() {
        initHeaderLeft();
        initHeaderMiddle();
        initHeaderRight();

        initTheme();
        initFontSize();
        initReadingMode();
    }

    function initHeaderLeft() {
        const header = document.getElementById('header-left');

        if (header.innerHTML !== '') {
            return;
        }

        header.innerHTML = `
            <div id="header-left-avatar">
                <a href="${getHomeLink()}" id="avatar-link"><img src="${URLS.AVATAR}" alt="${USERNAME}'s avatar" id="${AVATAR_IMG_ID}" class="avatar"></a>
            </div>`
    }

    function initHeaderMiddle() {
        const header = document.getElementById('header-middle');

        if (header.innerHTML !== '') {
            return;
        }

        header.innerHTML = `
            <div id="header-social-links">
                <a id="header-middle-linkedin-link", href="${URLS.LINKEDIN}" target="_blank"><i class="fab fa-linkedin fa-lg"></i></a>
                <a id="header-middle-github-link", href="${URLS.GITHUB}" target="_blank"><i class="fab fa-github fa-lg"></i></a></a>
                <a id="header-middle-articles-link" href="${getArticlesLink()}"><i class="far fa-newspaper fa-lg"></i></a>
                <a id="header-middle-home-link" href="${getHomeLink()}"><i class="fas fa-home"></i></a>
            </div>`
    }

    function initHeaderRight() {
        const header = document.getElementById('header-right');

        if (header.innerHTML !== '') {
            return;
        }

        header.innerHTML = `
            <button id="header-right-theme-toggle"><i class="fas fa-moon"></i></button>
            <button id="header-right-increase-font"><i class="fas fa-font"></i></button>
            <button id="header-right-decrease-font"><i class="fas fa-font" style="font-size: x-small"></i></button>
            <button id="header-right-reading-mode"><i class="far fa-file-image"></i></button>`
    }

    // ===== Header scroll behavior ===============================================

    const header = document.querySelector('#header');
    let lastScroll = 0;

    function debounce(func, wait) {
        let timeout;

        return function executedFunction(...args) {

            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const onScroll = debounce(() => {
        try {
            const currentScroll = window.scrollY;

            if (!header) {
                return;
            }

            if (currentScroll > lastScroll && currentScroll > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }

            lastScroll = currentScroll;
        } catch (error) {
            app.onError(error, 'Failed to handle scroll event.');
            throw error;
        }
    }, 25);

    window.addEventListener('scroll', onScroll);

    // ===== Theme ============================================================

    function initTheme() {
        try {
            const themeToggle = document.getElementById('header-right-theme-toggle');
            const savedTheme = app.getItem('theme');

            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }

            const currentTheme = document.documentElement.getAttribute('data-theme');
            const themeIcon = document.querySelector('#header-right-theme-toggle i');
            themeIcon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

            themeToggle.addEventListener('click', toggleTheme);
        } catch (error) {
            app.onError(error, 'Failed to initialize theme mode.');
            throw error;
        }
    }

    function toggleTheme() {
        try {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            const themeIcon = document.querySelector('#header-right-theme-toggle i');
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

            app.setItem('theme', newTheme);
        } catch (error) {
            app.onError(error, 'Failed to toggle dark mode.');
            throw error;
        }
    }

    // ==== Font-size =========================================================

    let fontSize = FONT_SIZES.DEFAULT;

    async function initFontSize() {
        try {
            const increaseFontButton = document.getElementById('header-right-increase-font');
            const decreaseFontButton = document.getElementById('header-right-decrease-font');

            increaseFontButton.addEventListener('click', () => changeFontSize(FONT_SIZES.STEP));
            decreaseFontButton.addEventListener('click', () => changeFontSize(-FONT_SIZES.STEP));

            const savedFontSize = app.safeParseInt(app.getItem('fontSize'));

            if (savedFontSize) {
                fontSize = savedFontSize;
                document.body.style.fontSize = `${fontSize}px`;
            }
        } catch (error) {
            app.onError(error, 'Failed to initialize font size controls.');
            throw error;
        }
    }

    function changeFontSize(value) {
        try {
            const newSize = fontSize + value;

            if (newSize >= FONT_SIZES.MIN && newSize <= FONT_SIZES.MAX) {
                fontSize = newSize;
                document.body.style.fontSize = `${fontSize}px`;
                app.setItem('fontSize', fontSize);
            }
        } catch (error) {
            app.onError(error, 'Failed to change font size.');
            throw error;
        }
    }

    // ===== Reading Mode =====================================================

    async function initReadingMode() {
        try {
            const readingModeToggle = document.querySelector('#header-right-reading-mode i');
            const savedReadingMode = app.getItem('reading-mode');

            const currentContentMode = savedReadingMode || 'text-and-image';
            document.documentElement.setAttribute('reading-mode', currentContentMode);

            readingModeToggle.className = currentContentMode === 'text-and-image' ? 'far fa-file-image' : 'far fa-file-alt';
            readingModeToggle.addEventListener('click', changeReadingMode);
            showHideImages(currentContentMode === 'text-only');
        } catch (error) {
            app.onError(error, 'Error in initializeTextAndImageMode');
        }
    }

    function changeReadingMode() {
        try {
            const readingModeToggle = document.querySelector('#header-right-reading-mode i');
            const currentContentMode = document.documentElement.getAttribute('reading-mode');
            const newContentMode = currentContentMode === 'text-and-image' ? 'text-only' : 'text-and-image';

            document.documentElement.setAttribute('reading-mode', newContentMode);
            readingModeToggle.className = newContentMode === 'text-and-image' ? 'far fa-file-image' : 'far fa-file-alt';

            app.setItem('reading-mode', newContentMode);
            showHideImages(newContentMode === 'text-only');
        } catch (error) {
            nzr.onError(error, 'Error in onContentModeClick');
        }
    }

    function showHideImages(hide = true) {
        try {
            const container = document.getElementById('main');
            const images = container.getElementsByTagName('img');

            for (const image of images) {
                if (image.classList.contains('avatar') || image.classList.contains('img-no-hide')) {
                    continue;
                }

                if (hide) {
                    hideImage(image);
                } else {
                    showImage(image);
                }
            }
        } catch (error) {
            app.onError(error, 'Error in showHideImages');
        }
    }

    function hideImage(image) {
        // Store original dimensions and styles
        const width = image.width || image.offsetWidth;
        const height = image.height || image.offsetHeight;
        const computedStyle = window.getComputedStyle(image);

        // Store original styles and replace image
        image.setAttribute('data-original-style', JSON.stringify({
            display: computedStyle.display,
        }));

        if (!image.classList.contains('img-no-placeholder')) {
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'img-placeholder';
            placeholder.innerHTML = 'Image hidden for eco-friendly printing 🍃.<br/>Toggle read mode in the toolbar to show image <i class="far fa-file-alt"></i>';

            // Match image dimensions if available
            if (width && height) {
                placeholder.style.width = '100%';
                placeholder.style.height = '40px';
            }

            image.parentNode.insertBefore(placeholder, image);

            // Store reference to placeholder
            image.setAttribute('data-placeholder-id', `placeholder-${Date.now()}`);
            placeholder.id = image.getAttribute('data-placeholder-id');
        }

        image.style.display = 'none';
    }

    function showImage(image) {
        // Restore original image
        const placeholderId = image.getAttribute('data-placeholder-id');

        if (placeholderId) {
            const placeholder = document.getElementById(placeholderId);

            if (placeholder) {
                placeholder.remove();
            }
        }

        // Restore original styles
        const originalStyle = JSON.parse(image.getAttribute('data-original-style') || '{}');
        Object.assign(image.style, originalStyle);
        image.style.display = originalStyle.display || '';

        // Clean up attributes
        image.removeAttribute('data-placeholder-id');
        image.removeAttribute('data-original-style');
    }


    // ============================================================================

    // ===== Extensions ===========================================================
    function getHomeLink() {
        return './index.html';
    }

    function getArticlesLink() {
        return './articles.html';
    }

    document.addEventListener('DOMContentLoaded', init);
})();