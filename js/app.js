(function () { // IIFE

    const app = {};
    globalThis.app = app;

    const VERSION = '1.0.1';
    const USERNAME = 'marionzr';
    const versionKey = "nzr";

    function onError(error, errorMessage) {
        console.error(`🐞 ${errorMessage}`, error);
    }

    // ===== Tools ============================================================

    function safeParseInt(value) {
        try {
            const parsedValue = parseInt(value, 10);
            return isNaN(parsedValue) ? null : parsedValue;
        } catch (error) {
            onError(error, 'Failed to parse integer value.');
            throw error;
        }
    }

    // ===== Storage ==========================================================

    function setItem(key, value, versionSpecific = true) {
        const storageKey = versionSpecific ? `${VERSION}_${key}` : key;
        localStorage.setItem(storageKey, value);
    }

    function getItem(key, versionSpecific = true) {
        const storageKey = versionSpecific ? `${VERSION}_${key}` : key;
        const data = localStorage.getItem(storageKey);

        return data;
    }

    // ==== Initialization ====================================================

    async function init() {
        try {
            console.log(`

    ·······································································
    :                                                                     :
    :  ███╗   ███╗ █████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗███████╗██████╗   :
    :  ████╗ ████║██╔══██╗██╔══██╗██║██╔═══██╗████╗  ██║╚══███╔╝██╔══██╗  :
    :  ██╔████╔██║███████║██████╔╝██║██║   ██║██╔██╗ ██║  ███╔╝ ██████╔╝  :
    :  ██║╚██╔╝██║██╔══██║██╔══██╗██║██║   ██║██║╚██╗██║ ███╔╝  ██╔══██╗  :
    :  ██║ ╚═╝ ██║██║  ██║██║  ██║██║╚██████╔╝██║ ╚████║███████╗██║  ██║  :
    :  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝  :
    :                                                                     :
    : https://www.linkedin.com/in/marionzr/                               :
    : https://www.github.com/marionzr/                                    :
    :                                                                     :
    : Crafted with Vanilla Js and nifty libraries to make it shine.       :
    ·······································································`);
        } catch (error) {
            onError(error);
        }
    }

    document.addEventListener('DOMContentLoaded', init);

    // ===== Events ===========================================================

    const Events = Object.freeze({
        InitStarted: `${init.name}Started`,
        InitCompleted: `${init.name}Completed`,
        InitFailed: `${init.name}Failed`,
    });

    // ===== Exports ==========================================================
    app.events = Events;
    app.onError = onError;
    app.setItem = setItem;
    app.getItem = getItem;
    app.safeParseInt = safeParseInt;
    app.VERSION = VERSION;
    app.USERNAME = USERNAME;
})();