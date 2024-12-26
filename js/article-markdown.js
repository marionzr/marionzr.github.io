(function () { // IIFE
    const app = globalThis.app;

    async function initMarkdownCodeBlock() {
        try {
            const mdBlock = document.querySelector('md-block');

            // Configure marked options to disable deprecated features
            mdBlock.markedOptions = {
                mangle: false,         // Disable mangling
                headerIds: false,      // Disable header IDs
                smartypants: false     // Disable smartypants
            };

            // Enable markdown parsing and syntax highlighting
            mdBlock.setAttribute('markdown', '');
            mdBlock.setAttribute('highlight', '');

            // First wait for the initial render
            await mdBlock.render();

            // Then wait for the rendered attribute to appear
            await new Promise((resolve, reject) => {
                if (mdBlock.hasAttribute('rendered')) {
                    resolve();
                    return;
                }

                const observer = new MutationObserver((mutations, obs) => {
                    if (mdBlock.hasAttribute('rendered')) {
                        obs.disconnect();
                        resolve();
                    }
                });

                observer.observe(mdBlock, {
                    attributes: true,
                    attributeFilter: ['rendered']
                });
            });

            if (window.Prism) {
                // Manually add the language class to pre elements
                document.querySelectorAll('pre code').forEach((block) => {
                    const parent = block.parentElement;
                    if (!parent.classList.contains('language-none')) {
                        parent.classList.add('language-none');
                        const lang = [...block.classList]
                            .find(className => className.startsWith('language-'));
                        if (lang) {
                            parent.classList.add(lang);
                        }
                    }
                });

                // Highlight all code blocks
                Prism.highlightAll();
            }
        } catch (error) {
            app.onError(error, 'Failed to initialize markdown code blocks.');
            throw error;
        }
    }

    function addImageCaptions() {
        const images = document.querySelectorAll('md-block img');
        images.forEach(img => {
            const altText = img.alt.trim();

            if (altText) {
                const caption = document.createElement("span");
                caption.classList.add('img-caption');
                caption.textContent = altText;

                // Append the caption after the image
                img.insertAdjacentElement('afterend', caption);
            }
        });
    }

    async function init() {
        await initMarkdownCodeBlock();
        addImageCaptions();
    }

    window.addEventListener('themeChanged', (event) => {
        const isDark = event.detail.theme === 'dark';
        document.getElementById('prism-light').disabled = isDark;
        document.getElementById('prism-dark').disabled = !isDark;
    });

    document.addEventListener('DOMContentLoaded', () => init());
})();