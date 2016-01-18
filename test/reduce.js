'use strict';

const expect = require('chai').expect;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = require('chai').should();
const cf = require('../index');

chai.use(chaiAsPromised);

const RAW_DATA = [1, 2, 3, 4, 5, 6, 7, 8];
const REDUCED_DATA = 36;

const syncAdd = (a, b) => a + b;
const asyncAdd = (a, b) => Promise.resolve(a + b);

describe("reduce", function() {

    it("returns a function when only given one argument", function() {
        return cf.reduce(function*(){}).should.be.a('function');
    });

    it("returns a function when only given two arguments", function() {
        return cf.reduce(function*(){}, 0).should.be.a('function');
    });

    it("reduces the given array of data using a generator function", function() {
        return cf.reduce(function* (acc, n) {
            return yield asyncAdd(acc, n);
        }, 0, RAW_DATA).should.eventually.eql(REDUCED_DATA);
    });

    it("reduces the given array of data using a function that returns a Promise", function() {
        return cf.reduce(asyncAdd, 0, RAW_DATA).should.eventually.eql(REDUCED_DATA);
    });

    it("reduces the given array of data using a function that returns the result directly", function() {
        return cf.reduce(syncAdd, 0, RAW_DATA).should.eventually.eql(REDUCED_DATA);
    });


});
