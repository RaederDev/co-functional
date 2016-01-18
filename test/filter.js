'use strict';

const expect = require('chai').expect;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = require('chai').should();
const cf = require('../index');

chai.use(chaiAsPromised);

const RAW_DATA = [1, 2, 3, 4, 5, 6, 7, 8];
const FILTERED_DATA = [2, 4, 6, 8];

const syncFilterEven = n => n % 2 === 0;
const asyncFilterEven = n => Promise.resolve(n % 2 === 0);
const asyncFilterEvenGenerator = function* asyncFilterEvenGenerator(n) {
    return yield Promise.resolve(n % 2 === 0);
};

describe("filter", function() {

    it("returns a function when only given one argument", function() {
        return cf.filter(asyncFilterEvenGenerator).should.be.a('function');
    });

    it("filters the given array of data using a generator function", function() {
        return cf.filter(asyncFilterEvenGenerator, RAW_DATA).should.eventually.eql(FILTERED_DATA);
    });

    it("filters the given array of data using a function that returns a Promise", function() {
        return cf.filter(asyncFilterEven, RAW_DATA).should.eventually.eql(FILTERED_DATA);
    });

    it("filters the given array of data using a function that returns the result directly", function() {
        return cf.filter(syncFilterEven, RAW_DATA).should.eventually.eql(FILTERED_DATA);
    });

});

describe("filterSerial", function() {

    it("returns a function when only given one argument", function() {
        return cf.filterSerial(asyncFilterEvenGenerator).should.be.a('function');
    });

    it("filters the given array of data using a generator function", function() {
        return cf.filterSerial(asyncFilterEvenGenerator, RAW_DATA).should.eventually.eql(FILTERED_DATA);
    });

    it("filters the given array of data using a function that returns a Promise", function() {
        return cf.filterSerial(asyncFilterEven, RAW_DATA).should.eventually.eql(FILTERED_DATA);
    });

    it("filters the given array of data using a function that returns the result directly", function() {
        return cf.filterSerial(syncFilterEven, RAW_DATA).should.eventually.eql(FILTERED_DATA);
    });

});