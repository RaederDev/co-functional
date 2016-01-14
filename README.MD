# co-functional

co-functional is a MIT licenced library that provides several functions for use with the [co](https://github.com/tj/co)
library. Functions are curried (where possible) and are always iteratee-first, data last.

Currently the library provides the following functions:
- [bind, lazyBind](#bind)
- [compose](#compose)
- [filter, filterSerial](#filter)
- [forEach, forEachSerial](#for-each)
- [map, mapSerial](#map)
- [reduce](#reduce)

## Installation
You can install co-functional using npm:
```
npm install --save co-functional
```
Then you can require it in your code:
```
const cf = require('co-functional');
```

Babelify transforms are defined in package.json.  
So you can also require co-functional in a browser in a non-ES2015 environment using browserify with babelify.

## Functions

Note that while in the following examples the returned Promises is handeled manually
you can of course yield the output of each function if you have a GeneratorFunction that is wrapped with co.

###[bind, lazyBind](#bind)

**"bind"** binds the given function to the given context and executes it.  
The given generator function will be wrapped in co.  
"bind" is curried so you may leave of the second parameter to delay execution.  
```javascript
const promise = cf.bind(function* (argument) {
    console.log(this); //scope that was bound
    console.log(argument); //1234
}, this, 1234).then(...);
```

**"lazyBind"** binds the given function to the given context and returns the bound function.  
The given generator function will be wrapped in co.  
"lazyBind" is curried so you may leave of the second parameter to delay execution.  
```javascript
const bound = cf.bind(function* (argument) {
    console.log(this); //scope that was bound
    console.log(argument); //1234
}, this);

const promise = bound(1234);
promise.then(...);
```

###[compose](#compose)

**"compose"** composes the given functions left to right.  
If a function returns a promise the chain will wait for the promise to resolve and continue with the resolved value.  
If you pass a generator function as a function it will be wrapped with co and executed.  
You may pass multiple parameters to the first function but note that the following functions will only receive one value.
```javascript
const composed = cf.compose(
     function(n) {
         console.log(n); //will log 3 to the console
     },
     function(n) {
         return Promise.resolve(n + 1);
     },
     function* (n) {
         return yield Promise.resolve(n + 1)
     },
     function(n) {
         return n + 1;
     }
);

composed(0).then(...).catch(...);
```

###[filter, filterSerial](#filter)

**"filter"** filters the given Array using the given generator function asynchronously.  
This function is curried so you may leave of the second parameter to delay execution.  
The given generator function will be wrapped with co prior to execution.  

```javascript
const asyncIsOddNumber = number => Promise.resolve(number % 2 === 0);
const promise = cf.filter(function* (number) {
    return yield asyncIsOddNumber(number);
}, [1, 2, 4]);

promise.then(oddNumbers => {
    console.log('All odd numbers: ', oddNumbers);
});
```

**"filterSerial"** filters the given Array using the given generator function asynchronously but one after another.  
If you want the highest possible speed you should not use this function but the completely asynchronous filter function!  
That means your elements will get filtered in order and the function will wait until something
has been returned by your GeneratorFunction before continuing execution.

This function is curried so you may leave of the second parameter to delay execution.  
The given generator function will be wrapped with co prior to execution.  

```javascript
const asyncIsOddNumber = number => Promise.resolve(number % 2 === 0);
const promise = cf.filter(function* (number) {
    return yield asyncIsOddNumber(number);
}, [1, 2, 4]);

promise.then(oddNumbers => {
    console.log('All odd numbers: ', oddNumbers);
});
```
###[forEach, forEachSerial](#for-each)

**"forEach"** loops over the given Array or Object asynchronously.  
This function is curried so you may leave of the second parameter to delay execution.  
The value is passed as the first, the key/index as the second parameter.  
The given generator function will be wrapped with co prior to execution.

```javascript
const promise = cf.forEach(function* (data, index) {
   console.log(data, index);
}, [2, 4]);

const promise2 = cf.forEach(function* (data, key) {
   console.log(data, key);
}, { a: 2, b: 4});
```

**"forEachSerial"** loops over the given Array or Object asynchronously but one after another.  
If you want the highest possible speed you should not use this function but the completely asynchronous forEach function!  
That means your elements will get looped over in order and the function will wait until something  
has been returned by your function before continuing execution.

This function is curried so you may leave of the second parameter to delay execution.  
The value is passed as the first, the key/index as the second parameter.  
The given generator function will be wrapped with co prior to execution.

```javascript
const promise = cf.forEachSerial(function* (data, index) {
   console.log(data, index);
}, [2, 4]);

const promise2 = cf.forEachSerial(function* (data, key) {
   console.log(data, key);
}, { a: 2, b: 4});
```

###[map, mapSerial](#map)
**"map"** maps over the given Array or Object asynchronously.  
If you pass an object it will be cloned to avoid modification.  
This function is curried so you may leave of the second parameter to delay execution.  
The value is passed as the first, the key/index as the second parameter.  
The given generator function will be wrapped with co prior to execution.  

```javascript
const double = value => Promise.resolve(value * 2);

const promise = cf.map(function* (number, index) {
   const someAsyncValue = yield double(number);
   return someAsyncValue;
}, [2, 4]);

const promise2 = cf.map(function* (data, key) {
   const someAsyncValue = yield double(data);
   return someAsyncValue;
}, { a: 2, b: 4});
```

**"mapSerial"** maps over the given Array or Object asynchronously but one after another.  
If you pass an object it will be cloned to avoid modification.  
If you want the highest possible speed you should not use this function but the completely asynchronous map function!  
That means your elements will get mapped over in order and the function will wait until something
has been returned by your function before continuing execution.

```javascript
const double = value => Promise.resolve(value * 2);

const promise = cf.mapSerial(function* (number, index) {
   const someAsyncValue = yield double(number);
   return someAsyncValue;
}, [2, 4]);

const promise2 = cf.mapSerial(function* (data, key) {
   const someAsyncValue = yield double(data);
   return someAsyncValue;
}, { a: 2, b: 4});
```

###[reduce](#reduce)
**"reduce"** reduces the given Array using the given generator function asynchronously but one after another.  
That means your elements will get filtered in order and the function will wait until somethin
has been returned by your function before continuing execution.

The function is passed the accumulator as the first Parameter, the current value as the second value
and the current Array index as the third parameter.

This function is curried so you may leave of any parameter to delay execution.  
The given generator function will be wrapped with co prior to execution.  

```javascript
const asyncAddNumber = (a, b) => Promise.resolve(a + b);
const promise = cf.reduce(function* (accumulator, number, arrayIndex) {
    return yield asyncAddNumber(number, accumulator);
}, 10, [1, 2]);

promise.then(result => console.log(result)); //13
```