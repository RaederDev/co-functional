'use strict';

const _ = require('lodash/fp');
const co = require('co');
const util = require('./util');

/**
 * Maps over the given Array or Object asynchronously. If you pass an object it will be cloned to avoid modification.
 * This function is curried so you may leave of the second parameter to delay execution.
 * The value is passed as the first, the key/index as the second parameter.
 * If the function returns a Promise the Promise will be resolved and the result will be used.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 *
 * Examples:
 * const result = yield cf.map(function* (number, index) {
 *     const someAsyncValue = yield getValue(number);
 *     return someAsyncValue;
 * }, [2, 4]);
 *
 * const result = yield cf.map(function* (data, key) {
 *     const someAsyncValue = yield getValue(data);
 *     return someAsyncValue;
 * }, { a: 2, b: 4});
 *
 * @param {GeneratorFunction} fn that will be mapped over the Object or Array.
 * @param {Object|Array} data that will be mapped over
 * @returns {Promise}
 */
const map = _.curry(function map(fn, data) {
    return co(function* () {

        if (util.isGenerator(fn)) {
            fn = co.wrap(fn);
        }

        //arrays
        if (_.isArray(data)) {
            //map into array of Promises
            let results = data.map((n, key) => fn(n, key));
            if (results.length < 1) {
                return [];
            }
            if (util.isPromise(results[0])) {
                results = yield results;
            }
            return results;
        }

        //objects
        else if (_.isObject(data)) {

            //we don't want to modify the target
            let clonedData = _.cloneDeep(data);

            //first we map all data into an Array
            let results = _.keysIn(clonedData)
                .map(key => fn(clonedData[key], key));

            if (results.length < 1) {
                return {};
            }

            if (util.isPromise(results[0])) {
                results = yield results;
            }

            //now we have to figure out which key belongs to which array index
            let i = 0;
            for (let key in clonedData) {
                clonedData[key] = results[i];
                i++;
            }

            return clonedData;
        }

        //error
        else {
            throw new Error(`You can only map over Objects and Arrays! Given: ${typeof data}`);
        }

    });
});

/**
 * Maps over the given Array or Object asynchronously but one after another. If you pass an object it will be cloned to avoid modification.
 * If you want the highest possible speed you should not use this function but the completely asynchronous map function!
 * That means your elements will get mapped over in order and the function will wait until something
 * has been returned by your function before continuing execution.
 *
 * This function is curried so you may leave of the second parameter to delay execution.
 * The value is passed as the first, the key/index as the second parameter.
 * If the function returns a Promise the Promise will be resolved and the result will be used.
 * If the given function is a GeneratorFunction it will be wrapped with co.
 *
 * Examples:
 * const result = yield cf.mapSerial(function* (number, index) {
 *     const someAsyncValue = yield getValue(number);
 *     return someAsyncValue;
 * }, [2, 4]);
 *
 * const result = yield cf.mapSerial(function* (data, key) {
 *     const someAsyncValue = yield getValue(data);
 *     return someAsyncValue;
 * }, { a: 2, b: 4});
 *
 * @param {GeneratorFunction} fn that will be mapped over the Object or Array.
 * @param {Object|Array} data that will be mapped over
 * @returns {Promise}
 */
const mapSerial = _.curry(function mapSerial(fn, data) {
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
            let clonedData = _.clone(data);
            //yield if we have a generator
            for (let i = 0; i < clonedData.length; i++) {
                let result = fn(clonedData[i], i);
                if (!hasChecked) {
                    hasChecked = true;
                    doesReturnPromises = util.isPromise(result);
                }
                if (doesReturnPromises) {
                    clonedData[i] = yield result;
                } else {
                    clonedData[i] = result;
                }
            }
            return clonedData;
        }

        //objects
        else if (_.isObject(data)) {
            //don't modify the provided object
            let clonedData = _.cloneDeep(data);
            for (let key in data) {
                let result = fn(clonedData[key], key);
                if (!hasChecked) {
                    hasChecked = true;
                    doesReturnPromises = util.isPromise(result);
                }
                if (doesReturnPromises) {
                    clonedData[key] = yield result;
                } else {
                    clonedData[key] = result;
                }
            }
            return clonedData;
        }

        //error
        else {
            throw new Error(`You can only map over Objects and Arrays! Given: ${typeof data}`);
        }

    });
});

module.exports = {
    map: map,
    mapSerial: mapSerial
};
