(function () { // IIFE

    const app = {};
    globalThis.app = app;

    const VERSION = '1.0.0';
    const USERNAME = 'marionzr';
    const VERSION_KEY = "nzr";
    const RESET_STORAGE_ON_NEW_VERSION = false;

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

    function parseDate(dateString) {
        try {
            // Handle date format like "2024-12-28 20:24:07 +0100"
            const parts = dateString.split(' ');
            const datePart = parts[0]; // "2024-12-28"
            const timePart = parts[1]; // "20:24:07"

            // Create date from parts
            const [year, month, day] = datePart.split('-');
            const [hour, minute, second] = timePart.split(':');

            return new Date(year, month - 1, day, hour, minute, second);
        } catch (error) {
            onError(error, 'Error parsing date');
            return null;
        }
    }

    function formatDate(date) {
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            onError(error, 'Failed to format date.');
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

    function initStorage() {
        try {
            const previousVersion = localStorage.getItem(VERSION_KEY);

            if (previousVersion !== null) {
                if (previousVersion !== VERSION) {
                    if (RESET_STORAGE_ON_NEW_VERSION) {
                        console.info(`Storage items created by  previous version ${previousVersion} are not compatible with new version ${VERSION}. Resetting the storage...`);
                        localStorage.clear();
                    } else {
                        console.info(`Storage items created by  previous version ${previousVersion} are compatible with new version ${VERSION}. Migrating the values.`);
                        migrateStorageItems(previousVersion, VERSION);
                    }
                }
            } else {
                console.info(`🆕 No version information found in the storage.`)
                localStorage.clear();
            }

            localStorage.setItem(VERSION_KEY, VERSION);
        } catch (error) {
            onError(error);
            localStorage.clear();
        }
    }

    function migrateStorageItems(previousVersion, version) {
        console.info(`Migrating LocalStorage from ${previousVersion} to ${version}.`);

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);

            if (key.startsWith(previousVersion)) {
                // Generate the new key with the new version prefix
                const newKey = key.replace(new RegExp(`^${previousVersion}`), version);

                // Set the new key with the same value
                localStorage.setItem(newKey, value);
                localStorage.removeItem(key);
            }
        }
    }


    // ==== Initialization ====================================================

    function init() {
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
            initStorage();

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
    app.formatDate = formatDate;
    app.parseDate = parseDate;
    app.VERSION = VERSION;
    app.USERNAME = USERNAME;
})();