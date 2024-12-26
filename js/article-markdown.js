(function () { // IIFE
    const app = globalThis.app;

    function initMarkdownCodeBlock() {
        try {
            const mdBlock = document.querySelector('md-block');
            mdBlock.setAttribute('markdown', '');
            mdBlock.setAttribute('highlight', '');

            // Wait for md-block to finish rendering
            mdBlock.render().then(() => {
                // Add a small delay to ensure DOM is updated
                setTimeout(() => {
                    if (window.Prism) {
                        // Manually add the language class to pre elements
                        document.querySelectorAll('pre code').forEach((block) => {
                            const parent = block.parentElement;
                            if (!parent.classList.contains('language-none')) {
                                parent.classList.add('language-none');
                                // Get language from class if it exists
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
                }, 100);
            });
        } catch (error) {
            app.onError(error, 'Failed to initialize markdown code blocks.');
            throw error;
        }
    }

    function init() {
        initMarkdownCodeBlock();
    }

    window.addEventListener('themeChanged', (event) => {
        const isDark = event.detail.theme === 'dark';
        document.getElementById('prism-light').disabled = isDark;
        document.getElementById('prism-dark').disabled = !isDark;
    });

    document.addEventListener('DOMContentLoaded', init);
})();