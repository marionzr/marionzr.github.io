(function () { // IIFE

    const app = globalThis.app;

    // ==== Initialization ========================================================

    function init() {
        try {
            // Hide to prevent self-navigation
            document.getElementById('header-middle-home-link').style.display = 'none';
        } catch (error) {
            app.onError(error, 'Failed to initialize articles page');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();