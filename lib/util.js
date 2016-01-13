'use strict';

const isGenerator = fn => {
    if(typeof fn.constructor !== 'undefined') {
        return fn.constructor.name === 'GeneratorFunction' || fn.constructor.displayName === 'GeneratorFunction';
    } return false;
};

module.exports = {
    isGenerator: isGenerator,
    noGeneratorError: () => new Error('The given fn parameter is not a generator function.')
};