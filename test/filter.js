'use strict';

const expect = require('chai').expect;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = require('chai').should();
const cf = require('../index');

chai.use(chaiAsPromised);

const RAW_DATA_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8];
const RAW_DATA_OBJECT = {
    a: 1,
    b: 2,
    c: 3
};

const asyncFilterEvenGenerator = function* asyncFilterEvenGenerator(n) {
    return yield Promise.resolve(n % 2 === 0);
};

describe("forEach", function() {

    it("returns a function when only given one argument", function() {
        return cf.forEach(function(){}).should.be.a('function');
    });

    it("loops through an Array using a generator function passing the value as the first, the key as the second argument", function() {
        const emptyData = [];
        cf.forEach(function* (value, key) {
            emptyData[key] = value;
        }, RAW_DATA_ARRAY);
        expect(emptyData).to.eql(RAW_DATA_ARRAY);
    });

    it("loops through an Object using a generator function passing the value as the first, the key as the second argument", function() {
        const emptyObject = {};
        cf.forEach(function* (value, key) {
            emptyObject[key] = value;
        }, RAW_DATA_OBJECT);
        expect(emptyObject).to.eql(RAW_DATA_OBJECT);
    });

});
