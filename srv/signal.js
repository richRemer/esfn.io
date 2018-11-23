// © 2018 Richard Remer
// Use is permitted under the MIT license. See LICENSE file.

export const RATE_DEFAULT = 100;

const {min} = Math;
const handlers = new WeakMap();
const signals = new Map();
const signalled = new Set();

let signalling = false;
let maxRate = RATE_DEFAULT;

/**
 * Signal model change, attach a signal handler to a model, or disconnect a
 * previously attached signal.
 * @param {object|Signal} model
 * @param {function} [handler]
 * @returns {Signal|undefined}
 */
export default function signal(model, handler) {
    if (handler) return attach(model, handler);
    else if (typeof model === "symbol") disconnect(model);
    else trigger(model);
}

/**
 * Adjust the maximum number of signals dispatched each time the signal event
 * loop is triggered.
 * @param {number} rate
 */
export function signalRate(rate) {
    if (rate <= 0 || !(isInteger(rate) || rate === Infinity)) {
        throw new TypeError("rate should be positive integer or Infinity");
    }

    maxRate = rate;
}

/**
 * Attach a signal handler.
 * @param {object} model
 * @param {function} handler
 * @returns {Signal}
 */
function attach(model, handler) {
    const signal = Symbol();

    if (!handlers.has(model)) {
        handlers.set(model, new Set());
    }

    handlers.get(model).add(handler);
    signals.set(signal, {model, handler});

    return signal;
}

/**
 * Trigger handlers for a model.
 * @param {object} model
 */
function trigger(model) {
    if (!handlers.has(model)) return;

    signalled.add(model);

    if (!signalling) {
        signalling = setTimeout(signalLoop, 0);
    }
}

/**
 * Disconnect signal handler.
 * @param {Signal} signal
 */
function disconnect(signal) {
    const {model, handler} = signals.get(signal);

    handlers.get(model).delete(handler);

    if (handlers.get(model).size === 0) {
        handlers.delete(model);
    }
}

/**
 * Internal rate-limited signaller.  Rate is number of signals which will be
 * dispatched per iteration.
 */
function signalLoop() {
    const signals = min(maxRate, signalled.size);
    const values = signalled.values();

    if (!signals && signalling) {
        clearTimeout(signalling);
        signalling = false;
        return;
    }

    for (let i = 0; i < signals; i++) {
        const model = values.next().value;
        const extant = handlers.get(model) || new Set();

        signalled.delete(model);

        for (let handler of extant) {
            setTimeout(() => handler(valueOf(model)), 0);
        }
    }

    setTimeout(signalLoop, 0);
}

/**
 * Evaluate by recursively calling .valueOf and return the final value.
 * @param {*} value
 */
function valueOf(value) {
    const cycled = new Set();

    while (hasValue(value) & !cycled.has(value)) {
        cycled.add(value);
        value = value.valueOf();
    }

    return value;
}

/**
 * Return true if the value can be further evaluated with .valueOf.
 * @param {*} value
 * @returns {boolean}
 */
function hasValue(value) {
    return Boolean(
        Object.prototype.isPrototypeOf(value)
        && typeof value.valueOf === "function"
        && value.valueOf !== Object.prototype.valueOf
    );
}
