'use strict';

const _ = require('lodash/fp');
const co = require('co');
const util = require('./util');

/**
 * Reduces the given Array using the given generator function asynchronously but one after another.
 * That means your elements will get filtered in order and the function will wait until something
 * has been returned by your function before continuing execution.
 *
 * The function is passed the accumulator as the first Parameter, the current value as the second value
 * and the current Array index as the third parameter.
 *
 * This function is curried so you may leave of any parameter to delay execution.
 * The given generator function will be wrapped with co prior to execution.
 *
 * Examples:
 * const result = yield reduce(function* (accumulator, number, arrayIndex) {
 *     return yield asyncAddNumber(number, accumulator);
 * }, 10, [1, 2]); //13
 *
 * @param {GeneratorFunction} fn that will be used to reduce the Array.
 * @param {*} accumulator that was returned from the function (and passed as an initial parameter)
 * @param {Object|Array} data that will be reduced.
 * @returns {Promise}
 */
const reduce = _.curry(function reduce(fn, accumulator, data) {
    return co(function* () {

        if(!util.isGenerator(fn)) {
            throw util.noGeneratorError();
        }

        const wrappedFn = co.wrap(fn);

        if (_.isArray(data)) {
            for(let i = 0; i < data.length; i++) {
                accumulator = yield wrappedFn(accumulator, data[i], i)
            }
            return accumulator;
        }

        //error
        else {
            throw new Error(`You can only filter Arrays! Given: ${typeof data}`);
        }

    });
});


module.exports = {
    reduce: reduce
};