'use strict';

const expect = require('chai').expect;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = require('chai').should();
const cf = require('../index');

chai.use(chaiAsPromised);

const RAW_DATA_ARRAY = [1, 2, 3, 4];
const MAPPED_DATA_ARRAY = [0, 2, 6, 12];
const RAW_DATA_OBJECT = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
};
const MAPPED_DATA_OBJECT = {
    a: '1a',
    b: '2b',
    c: '3c',
    d: '4d'
};

const mapArraySync = (value, key) => value * key;
const mapObjectSync = (value, key) => value + key;
const mapArrayAsync = (value, key) => Promise.resolve(value * key);
const mapObjectAsync = (value, key) => Promise.resolve(value + key);

describe("map", function() {

    it("returns a function when only given one argument", function() {
        return cf.map(function*(){}).should.be.a('function');
    });

    it("maps over the given Array using a GeneratorFunction", function() {
        return cf.map(function* (value, key) {
            return yield mapArrayAsync(value, key);
        }, RAW_DATA_ARRAY).should.eventually.eql(MAPPED_DATA_ARRAY);
    });

    it("maps over the given Array using a Function that returns a Promise", function() {
        return cf.map(mapArrayAsync, RAW_DATA_ARRAY).should.eventually.eql(MAPPED_DATA_ARRAY);
    });

    it("maps over the given Array using a Function that returns the result directly", function() {
        return cf.map(mapArraySync, RAW_DATA_ARRAY).should.eventually.eql(MAPPED_DATA_ARRAY);
    });

    it("maps over the given Object using a GeneratorFunction", function() {
        return cf.map(function* (value, key) {
            return yield mapObjectAsync(value, key);
        }, RAW_DATA_OBJECT).should.eventually.eql(MAPPED_DATA_OBJECT);
    });

    it("maps over the given Object using a Function that returns a Promise", function() {
        return cf.map(mapObjectAsync, RAW_DATA_OBJECT).should.eventually.eql(MAPPED_DATA_OBJECT);
    });

    it("maps over the given Object using a Function that returns the result directly", function() {
        return cf.map(mapObjectSync, RAW_DATA_OBJECT).should.eventually.eql(MAPPED_DATA_OBJECT);
    });

});

describe("mapSerial", function() {

    it("returns a function when only given one argument", function() {
        return cf.mapSerial(function*(){}).should.be.a('function');
    });

    it("maps over the given Array using a GeneratorFunction", function() {
        return cf.mapSerial(function* (value, key) {
            return yield mapArrayAsync(value, key);
        }, RAW_DATA_ARRAY).should.eventually.eql(MAPPED_DATA_ARRAY);
    });

    it("maps over the given Array using a Function that returns a Promise", function() {
        return cf.mapSerial(mapArrayAsync, RAW_DATA_ARRAY).should.eventually.eql(MAPPED_DATA_ARRAY);
    });

    it("maps over the given Array using a Function that returns the result directly", function() {
        return cf.mapSerial(mapArraySync, RAW_DATA_ARRAY).should.eventually.eql(MAPPED_DATA_ARRAY);
    });

    it("maps over the given Object using a GeneratorFunction", function() {
        return cf.mapSerial(function* (value, key) {
            return yield mapObjectAsync(value, key);
        }, RAW_DATA_OBJECT).should.eventually.eql(MAPPED_DATA_OBJECT);
    });

    it("maps over the given Object using a Function that returns a Promise", function() {
        return cf.mapSerial(mapObjectAsync, RAW_DATA_OBJECT).should.eventually.eql(MAPPED_DATA_OBJECT);
    });

    it("maps over the given Object using a Function that returns the result directly", function() {
        return cf.mapSerial(mapObjectSync, RAW_DATA_OBJECT).should.eventually.eql(MAPPED_DATA_OBJECT);
    });

});
