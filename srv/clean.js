const cleanups = new Map();

/**
 * Run cleanup callbacks registered for an object or register a new cleanup
 * callback.
 * @param {object} model
 * @param {function} [clean]
 */
export default function clean(model, clean) {
    if (arguments.length > 1) return addClean(model, clean);
    else return runClean(model);
}

/**
 * Register cleanup function.
 * @param {object} model
 * @param {function} clean
 */
function addClean(model, clean) {
    if (!cleanups.has(model)) {
        cleanups.set(model, new Set());
    }

    cleanups.get(model).add(clean);
}

/**
 * Run cleanup functions.
 * @param {object} model
 */
function runClean(model) {
    if (cleanups.has(model)) for (let clean of cleanups.get(model)) {
        clean();
    }

    cleanups.delete(model);
}
