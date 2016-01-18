'use strict';

const co = require('co');
const _ = require('lodash/fp');
const util = require('./util');

/**
 * Binds the given function to the given context and executes it.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 * This function is curried so you may leave of the second parameter to delay execution.
 *
 * Example:
 * const promise = cf.bind(function* (argument) {
 *     console.log(this); //scope that was bound
 *     console.log(argument); //1234
 * }, this, 1234);
 *
 * @param {GeneratorFunction} fn to bind
 * @param {*} scope that the function should be bound to
 * @returns {Promise}
 */
const bind = _.curry(function bind(fn, scope) {
    const data = Array.prototype.slice.call(arguments);
    if(util.isGenerator(fn)) {
        return co.wrap(fn).apply(scope, data.slice(2));
    } else {
        return Promise.resolve(fn.apply(scope, data.slice(2)));
    }
});

/**
 * Binds the given function to the given context and returns the bound function.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 * This function is curried so you may leave of the second parameter to delay execution.
 *
 * Example:
 * const bound = cf.lazyBind(function* (argument) {
 *     console.log(this); //scope that was bound
 *     console.log(argument); //1234
 * }, this);
 *
 * const promise = bound(1234);
 *
 * @param {GeneratorFunction} fn to bind
 * @param {*} scope that the function should be bound to
 * @returns {Function}
 */
const lazyBind = _.curry(function bind(fn, scope) {
    return function bindInner() {
        if(util.isGenerator(fn)) {
            return co.wrap(fn).apply(scope, arguments);
        } else {
            return Promise.resolve(fn.apply(scope, arguments));
        }
    };
});

module.exports = {
    bind: bind,
    lazyBind: lazyBind
};
