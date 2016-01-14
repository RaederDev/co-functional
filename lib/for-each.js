'use strict';

const _ = require('lodash/fp');
const co = require('co');
const util = require('./util');

/**
 * Loops over the given Array or Object asynchronously.
 * This function is curried so you may leave of the second parameter to delay execution.
 * The value is passed as the first, the key/index as the second parameter.
 * The given generator function will be wrapped with co prior to execution.
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

        if(!util.isGenerator(fn)) {
            throw util.noGeneratorError();
        }

        const wrappedFn = co.wrap(fn);

        //objects
        if(_.isObject(data)) {
            const promises = [];
            for(let key in data) {
                promises.push(wrappedFn(data[key], key));
            }
            yield promises;
        }

        //arrays
        else if (_.isArray(data)) {
            const promises = [];
            for(let i = 0; i < data.length; i++) {
                promises.push(wrappedFn(data[i], i));
            }
            yield promises;
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
 * The given generator function will be wrapped with co prior to execution.
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
const forEachSerial = _.curry(function forEachSerial(fn, data) {
    return co(function* () {

        if(!util.isGenerator(fn)) {
            throw util.noGeneratorError();
        }

        const wrappedFn = co.wrap(fn);

        //objects
        if(_.isObject(data)) {
            for(let key in data) {
                yield wrappedFn(data[key], key);
            }
        }

        //arrays
        else if (_.isArray(data)) {
            for(let i = 0; i < data.length; i++) {
                yield wrappedFn(data[i], i);
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