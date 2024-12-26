(function () { // IIFE
    const app = globalThis.app;

    async function initMarkdownCodeBlock() {
        try {
            const mdBlock = document.querySelector('md-block');

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

    function configureMarkdownLinksToOpenOnNewTab() {
        const mdBlock = document.querySelector('md-block');
        const links = mdBlock.querySelectorAll('a');

        links.forEach(function (link) {
            link.setAttribute('target', '_blank');
        });
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

    function addCodeBlockCopyButton() {
        const codeBlocks = document.querySelectorAll('pre > code');

        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;

            const container = document.createElement('div');
            container.className = 'md-block-code-block-container';

            const header = document.createElement('div');
            header.className = 'md-block-code-block-container-header';

            // Extract language from class
            const languageMatch = pre.className.match(/language-(\w+)/);
            const language = languageMatch ? languageMatch[1] : 'text';

            const languageLabel = document.createElement('span');
            languageLabel.className = 'md-block-code-block-language-label';
            languageLabel.textContent = language;

            const copyButton = document.createElement('button');
            copyButton.className = 'md-block-code-block-container-copy-button';
            copyButton.innerHTML = '<i class="far fa-copy"></i><span>Copy</span>';

            copyButton.addEventListener('click', async () => copyContent(copyButton, codeBlock.textContent));

            // Remove language class from pre since it's now in header
            pre.className = pre.className.replace(/language-\w+/, '').trim();

            header.appendChild(languageLabel);
            header.appendChild(copyButton);

            // Replace pre with container and move elements
            pre.parentNode.replaceChild(container, pre);
            container.appendChild(header);
            container.appendChild(pre);
        });
    }

    async function copyContent(copyButton, textToCopy) {
        try {
            await navigator.clipboard.writeText(textToCopy);

            // Store original button content
            const originalContent = copyButton.innerHTML;

            // Update button to show copied state
            copyButton.innerHTML = '<i class="fas fa-check"></i><span>Copied</span>';

            // Reset after 3 seconds
            setTimeout(() => {
                copyButton.innerHTML = originalContent;
            }, 1500);
        } catch (err) {
            nzr.onError(err, 'Failed to copy text');
        }
    }

    function calculateReadingTime() {
        try {
            const mdBlocks = document.querySelectorAll("md-block");
            const articleHeaderInfoMetadataReadingTimeEta = article.querySelector('#article-header-info-matadata-reading-time-eta');
            const articleHeaderInfoMetadataReadingTimeWords = article.querySelector('#article-header-info-matadata-reading-time-words');

            let totalWords = 0;
            let totalTime = 0;

            mdBlocks.forEach(function(mdBlock) {
                const result = mdReadingTime(mdBlock.textContent);
                totalTime += app.safeParseInt(result.time); // ETA (time to read)
                totalWords += result.words;
            });

            articleHeaderInfoMetadataReadingTimeEta.textContent = totalTime > 1 ? `${totalTime} min` : "Less than 1 min";
            articleHeaderInfoMetadataReadingTimeWords.textContent = totalWords;
        } catch (error) {
            app.onError(error, 'Error in calculateReadingTime');
        }
    }

    async function init() {
        await initMarkdownCodeBlock();
        addImageCaptions();
        configureMarkdownLinksToOpenOnNewTab();
        addCodeBlockCopyButton();
        calculateReadingTime();
    }

    window.addEventListener('themeChanged', (event) => {
        const isDark = event.detail.theme === 'dark';
        document.getElementById('prism-light').disabled = isDark;
        document.getElementById('prism-dark').disabled = !isDark;
    });

    document.addEventListener('DOMContentLoaded', () => init());
})();