'use strict';

const _ = require('lodash/fp');
const co = require('co');
const util = require('./util');

/**
 * Loops over the given Array or Object asynchronously.
 * This function is curried so you may leave of the second parameter to delay execution.
 * The value is passed as the first, the key/index as the second parameter.
 * If the function returns a Promise the Promise execution will halt until all Promises have been resolved.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 *
 * Examples:
 * const result = yield cf.forEach(function* (number, index) {
 *     const someAsyncValue = yield getValue(number);
 *     console.log(someAsyncValue);
 * }, [2, 4]);
 *
 * const result = yield cf.forEach(function* (data, key) {
 *     const someAsyncValue = yield getValue(data);
 *     console.log(someAsyncValue);
 * }, { a: 2, b: 4});
 *
 * @param {GeneratorFunction} fn that will be used to iterate over the Object or Array.
 * @param {Object|Array} data that will be used.
 * @returns {Promise}
 */
const forEach = _.curry(function forEach(fn, data) {
    return co(function* () {

        if (util.isGenerator(fn)) {
            fn = co.wrap(fn);
        }

        //arrays
        if (_.isArray(data)) {
            let returnedData = [];
            for (let i = 0; i < data.length; i++) {
                returnedData.push(fn(data[i], i));
            }
            if (returnedData.length > 0) {
                if (util.isPromise(returnedData[0])) {
                    yield returnedData;
                }
            }
        }

        //objects
        else if (_.isObject(data)) {
            let returnedData = [];
            for (let key in data) {
                returnedData.push(fn(data[key], key));
            }
            if (returnedData.length > 0) {
                if (util.isPromise(returnedData[0])) {
                    yield returnedData;
                }
            }
        }

        //error
        else {
            throw new Error(`You can only iterate over Objects and Arrays! Given: ${typeof data}`);
        }

    });
});

/**
 * Loops over the given Array or Object asynchronously but one after another.
 * If you want the highest possible speed you should not use this function but the completely asynchronous forEach function!
 * That means your elements will get looped over in order and the function will wait until something
 * has been returned by your function before continuing execution.
 *
 * This function is curried so you may leave of the second parameter to delay execution.
 * The value is passed as the first, the key/index as the second parameter.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 *
 * Examples:
 * const result = yield cf.forEachSerial(function* (number, index) {
 *     const someAsyncValue = yield getValue(number);
 *     console.log(someAsyncValue);
 * }, [2, 4]);
 *
 * const result = yield cf.forEachSerial(function* (data, key) {
 *     const someAsyncValue = yield getValue(data);
 *     console.log(someAsyncValue);
 * }, { a: 2, b: 4});
 *
 * @param {GeneratorFunction} fn that will be used to iterate over the Object or Array.
 * @param {Object|Array} data that will be used.
 * @returns {Promise}
 */
const forEachSerial = _.curry(function forEachSerial(fn, data) {
    return co(function* () {

        if (util.isGenerator(fn)) {
            fn = co.wrap(fn);
        }

        //we only check if the first function call returns a Promise to avoid
        //costly type checks in every iteration
        let doesReturnPromises = false;
        let hasChecked = false; //we need this for Objects since we have no index

        //arrays
        if (_.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                let result = fn(data[i], i);
                if (!hasChecked) {
                    hasChecked = true;
                    doesReturnPromises = util.isPromise(result);
                }
                if (doesReturnPromises) {
                    yield result;
                }
            }
        }

        //objects
        else if (_.isObject(data)) {
            for (let key in data) {
                let result = fn(data[key], key);
                if (!hasChecked) {
                    hasChecked = true;
                    doesReturnPromises = util.isPromise(result);
                }
                if (doesReturnPromises) {
                    yield result;
                }
            }
        }

        //error
        else {
            throw new Error(`You can only iterate over Objects and Arrays! Given: ${typeof data}`);
        }

    });
});


module.exports = {
    forEach: forEach,
    forEachSerial: forEachSerial
};
