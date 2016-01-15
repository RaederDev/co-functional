'use strict';

const co = require('co');
const _ = require('lodash/fp');
const util = require('./util');

/**
 * Binds the given function to the given context and executes it.
 * The given generator function will be wrapped in co.
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
    if(!util.isGenerator(fn)) {
        throw util.noGeneratorError();
    }
    const data = Array.prototype.slice.call(arguments);
    return co.wrap(fn).apply(scope, data.slice(2));
});

/**
 * Binds the given function to the given context and returns the bound function.
 * The given generator function will be wrapped in co.
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
    if(!util.isGenerator(fn)) {
        throw util.noGeneratorError();
    }
    return function bindInner() {
        return co.wrap(fn).apply(scope, arguments);
    };
});

module.exports = {
    bind: bind,
    lazyBind: lazyBind
};
