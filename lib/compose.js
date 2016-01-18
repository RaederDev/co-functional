'use strict';

const co = require('co');
const util = require('./util');

/**
 * Performs the actual composition
 *
 * @param fns
 * @param data
 * @return {*}
 * @private
 */
const _compose = function _compose(fns, data) {
    return co(function* () {

        let result = undefined;

        //iterate over functions and apply each one
        for(let i = 0; i < fns.length; i++) {

            let fn = fns[i];
            let passToFn = (i === 0) ? data : [result];

            //if we have a generator then we yield the value
            if(util.isGenerator(fn)) {
                result = yield co.wrap(fn).apply(this, passToFn);
            } else {
                result = fn.apply(this, passToFn);
                //if the function returns a promise we yield it
                if(util.isPromise(result)) {
                    result = yield result;
                }
            }

        }

        return result;

    })
};

/**
 * Composes the given functions right to left.
 * If a function returns a promise the chain will wait for the promise to resolve
 * and continue with the resolved value. If you pass a GeneratorFunction as a function
 * it will be wrapped with co and executed.
 *
 * You may pass multiple parameters to the first function but note that the following
 * functions will only receive one value.
 *
 * Example:
 * const composed = cf.compose(
 *     function(n) {
 *         console.log(n);
 *     },
 *     function(n) {
 *         return Promise.resolve(n + 1);
 *     },
 *     function* (n) {
 *         return yield Promise.resolve(n + 1)
 *     },
 *     function(n) {
 *         return n + 1;
 *     }
 * );
 *
 * composed(0).then(...).catch(...);
 *
 * Will print "3" to the console.
 *
 * @returns {Promise}
 */
const compose = function compose() {
    const fns = Array.prototype.slice.call(arguments); //no spread support in older node versions :(
    return function() {
        const data = Array.prototype.slice.call(arguments);
        return _compose(fns.reverse(), data);
    };
};

module.exports = {
    compose: compose
};
