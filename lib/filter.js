'use strict';

const _ = require('lodash/fp');
const co = require('co');
const util = require('./util');

/**
 * Filters the given Array using the given function asynchronously.
 * This function is curried so you may leave of the second parameter to delay execution.
 * If the function returns a Promise the Promise will be resolved and the result will be used.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 *
 * Example:
 * const result = yield cf.filter(function* (number) {
 *     return yield asyncIsOddNumber(number);
 * }, [1, 2, 4]);
 *
 * @param {GeneratorFunction} fn that will be used to filter the Array.
 * @param {Object|Array} data that will be filtered.
 * @returns {Promise}
 */
const filter = _.curry(function filter(fn, data) {
    return co(function* () {

        if (_.isArray(data)) {

            if(util.isGenerator(fn)) {
                fn = co.wrap(fn);
            }

            //first build an Array of Promises that will contain if data at a specific index passed the test
            let filteredData = [];
            for(let i = 0; i < data.length; i++) {
                filteredData.push(fn(data[i]));
            }

            if(filteredData.length < 1) {
                return [];
            }

            //if the function did return a Promise we'll yield it
            if(util.isPromise(filteredData[0])) {
                //resolve promises in parallel
                filteredData = yield filteredData;
            }

            //now we fill a result array with the filtered data
            let result = [];
            for(let i = 0; i < data.length; i++) {
                if(filteredData[i]) {
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
 * If the function returns a Promise the Promise will be resolved and the result will be used.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 *
 * Example:
 * const result = yield cf.filterSerial(function* (number) {
 *     return yield asyncIsOddNumber(number);
 * }, [1, 2, 4]);
 *
 * @param {GeneratorFunction} fn that will be used to filter the Array.
 * @param {Object|Array} data that will be filtered.
 * @returns {Promise}
 */
const filterSerial = _.curry(function filter(fn, data) {
    return co(function* () {

        if(util.isGenerator(fn)) {
            fn = co.wrap(fn);
        }

        //filter array
        if (_.isArray(data)) {
            let result = [];
            for(let i = 0; i < data.length; i++) {
                let fnResult = fn(data[i]);
                let isPromise = util.isPromise(fnResult);
                if((isPromise && (yield fnResult)) || (!isPromise && fnResult)) {
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