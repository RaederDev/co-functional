'use strict';

const _ = require('lodash/fp');
const co = require('co');
const util = require('./util');

/**
 * Reduces the given Array using the given function asynchronously but one after another.
 * That means your elements will get reduced in order and the function will wait until something
 * has been returned by your function before continuing execution.
 *
 * The function is passed the accumulator as the first Parameter, the current value as the second value
 * and the current Array index as the third parameter.
 *
 * This function is curried so you may leave of any parameter to delay execution.
 * If the function returns a Promise the Promise will be resolved and the result will be used.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 *
 * Example:
 * const result = yield cf.reduce(function* (accumulator, number, arrayIndex) {
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

        if(util.isGenerator(fn)) {
            fn = co.wrap(fn);
        }

        let doesReturnPromises = false;

        if (_.isArray(data)) {
            for(let i = 0; i < data.length; i++) {
                accumulator = fn(accumulator, data[i], i);
                if(i === 0) {
                    doesReturnPromises = util.isPromise(accumulator)
                }
                if(doesReturnPromises) {
                    accumulator = yield accumulator;
                }
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