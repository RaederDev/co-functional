'use strict';

const _ = require('lodash/fp');
const co = require('co');
const util = require('./util');

const transduce = _.curry(function transduce(builder, transformer, accumulator, data) {
    return co(function*() {

        //we check if the function returns promises or not. For performance
        //reasons we only check the first element and then rely on our variable.
        let doesReturnPromise = false;

        if(_.isArrayLike(data)) {
            for(let i = 0; i < data.length; i++) {

            }
            return accumulated;
        }

        else if(util.hasIterator(data)) {

        }

        else if(_.isObject(data)) {

        }

        else {

        }
    });
});

