const utils = require('../index');
const co = require('co');

const slowDouble = data => new Promise(resolve => {
    setTimeout(() => resolve(data * 2), 2000);
});

const slowIsOddNumber = data => new Promise(resolve => {
    setTimeout(() => resolve(data % 2 === 0), 1000);
});

const slowAdd = (n1, n2) => new Promise(resolve => {
    setTimeout(() => resolve(n1 + n2), 1000);
});

const onError = error => console.error(error);

//map
co(function* () {
    const result = yield utils.map(function* (number) {
        return yield slowDouble(number);
    }, [2, 4, 6]);
    console.log('Parallel execution - map', result);
}).catch(onError);

co(function* () {
    const result = yield utils.mapSerial(function* (number) {
        return yield slowDouble(number);
    }, [2, 4, 6]);
    console.log('Serial execution - map', result);
}).catch(onError);

co(function* () {
    const result = yield utils.map(function* (number) {
        return slowDouble(number);
    }, {
        a: 2,
        b: 4,
        c: 6
    });
    console.log('Parallel execution - map', result);
}).catch(onError);

co(function* () {
    const result = yield utils.mapSerial(function* (number) {
        return yield slowDouble(number);
    }, {
        a: 2,
        b: 4,
        c: 6
    });
    console.log('Serial execution - map', result);
}).catch(onError);

//filter
co(function* () {
    const result = yield utils.filter(function* (number) {
        return yield slowIsOddNumber(number);
    }, [1, 2, 3, 4, 5, 6]);
    console.log('Parallel execution - filter', result);
}).catch(onError);

co(function* () {
    const result = yield utils.filterSerial(function* (number) {
        return yield slowIsOddNumber(number);
    }, [1, 2, 3, 4, 5, 6]);
    console.log('Parallel execution - filter', result);
}).catch(onError);

//forEach
co(function* () {
    yield utils.forEach(function* (number, index) {
        console.log('inside forEach - parallel', number, index);
    }, [2, 4, 6]);
}).catch(onError);

co(function* () {
    yield utils.forEach(function* (number, index) {
        console.log('inside forEach - serial', number, index);
    }, [2, 4, 6]);
}).catch(onError);

co(function* () {
    yield utils.forEach(function* (number, index) {
        console.log('inside forEach - parallel', number, index);
    }, {
        a: 2,
        b: 4,
        c: 6
    });
}).catch(onError);

co(function* () {
    yield utils.forEach(function* (number, index) {
        console.log('inside forEach - serial', number, index);
    }, {
        a: 2,
        b: 4,
        c: 6
    });
}).catch(onError);

//reduce
co(function* () {
    const result = yield utils.reduce(function* (acc, number) {
        return yield slowAdd(acc, number);
    }, 10, [1, 2, 3, 4, 5, 6]);
    console.log('Serial execution - reduce', result);
}).catch(onError);

//compose
const composed = utils.compose(
    function(n) {
      console.log(n);
    },
    function(n) {
        return Promise.resolve(n + 1);
    },
    function* (n) {
        return yield Promise.resolve(n + 1)
    },
    function(n) {
        return n;
    }
);

console.log(composed);
composed(0).catch(onError);
























