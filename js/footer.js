(function () { // IIFE

    const app = globalThis.app;

    const URLS = {
        LINKEDIN: 'https://www.linkedin.com/in/marionzr',
        GITHUB: 'https://www.github.com/marionzr',
        GITHUB_ISSUES: 'https://www.github.com/marionzr/marionzr.github.io/issues/new?',
    };

    const USERNAME = 'marionzr';

    function init() {
        initFooterLeft();
        initFooterMiddle();
        initFooterRight();
    }

    function initFooterLeft() {
        const footer = document.getElementById('footer-left');

        if (footer.innerHTML !== '') {
            return;
        }

        footer.innerHTML = `
            <div id="footer-social-links">
                <a href="${URLS.LINKEDIN}" target="_blank"><i class="fab fa-linkedin"></i> </a><a href="${URLS.LINKEDIN}" class="social-media-icon-link-text">${USERNAME}</a>
                <div class="social-media-icon-link-text"> | </div>
                <a href="${URLS.GITHUB}" target="_blank"><i class="fab fa-github"></i></a> <a href="${URLS.GITHUB}" class="social-media-icon-link-text">${USERNAME}</a>
            </div>`
    }

    function initFooterMiddle() {
        const footer = document.getElementById('footer-middle');

        if (footer.innerHTML !== '') {
            return;
        }

        footer.innerHTML = `<div></div>`
    }

    function initFooterRight() {
        const footer = document.getElementById('footer-right');

        if (footer.innerHTML !== '') {
            return;
        }

        const div = document.createElement('div');
        const reportBugIcon = document.createElement('i');
        reportBugIcon.id = 'footer-report-bug';
        reportBugIcon.classList.add('fa');
        reportBugIcon.classList.add('fa-bug');
        reportBugIcon.addEventListener('click', reportBug);
        div.appendChild(reportBugIcon);
        footer.appendChild(div);
    }

    function reportBug() {
        try {
            const bugData = collectBugReportData();
            const body = `
                Please describe the issue you encountered above this line.

                Disclaimer: The following data is non-sensitive and only collected when you click the "Report Bug" button.
                You can delete any or all of these entries if you don't agree with the collection.

                -----
                Browser: ${bugData.browser}
                Screen Resolution: ${bugData.screenResolution}
                Viewport Size: ${bugData.viewportSize}
                Language: ${bugData.language}
                Cookies Enabled: ${bugData.cookiesEnabled}
                Local Storage Available: ${bugData.localStorageAvailable}
                Device Type: ${bugData.deviceType}
                Current URL: ${bugData.currentURL}
                Referrer: ${bugData.referrer}
                Timestamp: ${bugData.timestamp}
                Error Logs: ${JSON.stringify(bugData.errorLogs, null, 2)}
            `;

            const tags = [
                'bug',
                bugData.browser,
                bugData.deviceType
            ];

            const labels = tags.join(',');
            const url = `${URLS.GITHUB_ISSUES}?title=Bug%20Report&body=${encodeURIComponent(body)}&labels=${encodeURIComponent(labels)}`;
            window.open(url, '_blank');
        } catch (error) {
            app.onError(error, 'Failed to report bug.');
            throw error;
        }
    }

    function collectBugReportData() {
        try {
            return {
                browser: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language,
                cookiesEnabled: navigator.cookieEnabled,
                localStorageAvailable: typeof window.localStorage !== "undefined",
                deviceType: window.matchMedia("(pointer: coarse)").matches ? "Touch Device" : "Non-touch Device",
                currentURL: window.location.href,
                referrer: document.referrer,
                timestamp: new Date().toISOString(),
                errorLogs: []
            };
        } catch (error) {
            app.onError(error, 'Failed to collect bug report data.');
            throw error;
        }
    }
    // ============================================================================

    document.addEventListener('DOMContentLoaded', init);
})();