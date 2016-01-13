'use strict';

const _ = require('lodash-fp');
const co = require('co');
const util = require('./util');

/**
 * Filters the given Array using the given generator function asynchronously.
 * This function is curried so you may leave of the second parameter to delay execution.
 * The given generator function will be wrapped with co prior to execution.
 *
 * Examples:
 * const result = yield filter(function* (number) {
 *     return yield asyncIsOddNumber(number);
 * }, [1, 2, 4]);
 *
 * @param {GeneratorFunction} fn that will be used to filter the Array.
 * @param {Object|Array} data that will be filtered.
 * @returns {Promise}
 */
const filter = _.curry(function filter(fn, data) {
    return co(function* () {

        if(!util.isGenerator(fn)) {
            throw util.noGeneratorError();
        }

        const wrappedFn = co.wrap(fn);

        if (_.isArray(data)) {

            //first build an Array of Promises that will contain if data at a specific index passed the test
            const promises = [];
            for(let i = 0; i < data.length; i++) {
                promises.push(wrappedFn(data[i]));
            }

            //resolve promises in parallel
            const resolved = yield promises;

            //now we fill a result array with the filtered data
            const result = [];
            for(let i = 0; i < data.length; i++) {
                if(resolved[i]) {
                    result.push(data[i]);
                }
            }

            return result;
        }

        //error
        else {
            throw new Error(`You can only filter Arrays! Given: ${typeof data}`);
        }

    });
});

/**
 * Filters the given Array using the given generator function asynchronously but one after another.
 * If you want the highest possible speed you should not use this function but the completely asynchronous filter function!
 * That means your elements will get filtered in order and the function will wait until something
 * has been returned by your function before continuing execution.
 *
 * This function is curried so you may leave of the second parameter to delay execution.
 * The given generator function will be wrapped with co prior to execution.
 *
 * Examples:
 * const result = yield filter(function* (number) {
 *     return yield asyncIsOddNumber(number);
 * }, [1, 2, 4]);
 *
 * @param {GeneratorFunction} fn that will be used to filter the Array.
 * @param {Object|Array} data that will be filtered.
 * @returns {Promise}
 */
const filterSerial = _.curry(function filter(fn, data) {
    return co(function* () {

        if(!util.isGenerator(fn)) {
            throw util.noGeneratorError();
        }

        const wrappedFn = co.wrap(fn);

        //filter array
        if (_.isArray(data)) {
            const result = [];
            for(let i = 0; i < data.length; i++) {
                if(yield wrappedFn(data[i])) {
                    result.push(data[i]);
                }
            }
            return result;
        }

        //error
        else {
            throw new Error(`You can only filter Arrays! Given: ${typeof data}`);
        }

    });
});

module.exports = {
    filter: filter,
    filterSerial: filterSerial
};