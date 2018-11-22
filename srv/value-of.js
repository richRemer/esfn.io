// © 2018 Richard Remer
// Use is permitted under the MIT license. See LICENSE file.

/**
 * Evaluate object by recursively calling .valueOf, or simply return value.
 * @param {*} val
 */
export default function valueOf(val) {
    const cycled = new Set();

    while (!evaluated(val) && !cycled.has(val)) {
        cycled.add(val);
        val = val.valueOf();
    }

    return val;
}

/**
 * Return true if value is fully evaluated.
 * @param {*} val
 * @returns {boolean}
 */
function evaluated(val) {
    return !Boolean(
        Object.prototype.isPrototypeOf(val)
        && typeof val.valueOf === "function"
        && val.valueOf !== Object.prototype.valueOf
    );
}
