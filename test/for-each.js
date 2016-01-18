'use strict';

const expect = require('chai').expect;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = require('chai').should();
const cf = require('../index');

chai.use(chaiAsPromised);

const DATA_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8];
const DATA_OBJECT = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
};

describe("forEach", function() {

    it("returns a function when only given one argument", function() {
        return cf.forEach(function*(){}).should.be.a('function');
    });

    it("loops through the given Array using a GeneratorFunction", function(done) {
        const newData = [];
        cf.forEach(function* (value, key) {
            newData[key] = yield Promise.resolve(value);
        }, DATA_ARRAY).then(function() {
            expect(newData).to.eql(DATA_ARRAY);
            done();
        }).catch(err => console.error(err));
    });

    it("loops through the given Array using a Function", function(done) {
        const newData = [];
        cf.forEach(function (value, key) {
            newData[key] = value;
        }, DATA_ARRAY).then(function() {
            expect(newData).to.eql(DATA_ARRAY);
            done();
        }).catch(err => console.error(err));
    });

    it("loops through the given Object using a GeneratorFunction", function(done) {
        const newData = {};
        cf.forEach(function* (value, key) {
            newData[key] = yield Promise.resolve(value);
        }, DATA_OBJECT).then(function() {
            expect(newData).to.eql(DATA_OBJECT);
            done();
        }).catch(err => console.error(err));
    });

    it("loops through the given Object using a Function", function(done) {
        const newData = {};
        cf.forEach(function (value, key) {
            newData[key] = value;
        }, DATA_OBJECT).then(function() {
            expect(newData).to.eql(DATA_OBJECT);
            done();
        }).catch(err => console.error(err));
    });

});

describe("forEachSerial", function() {

    it("returns a function when only given one argument", function() {
        return cf.forEachSerial(function*(){}).should.be.a('function');
    });

    it("loops through the given Array using a GeneratorFunction", function(done) {
        const newData = [];
        cf.forEachSerial(function* (value, key) {
            newData[key] = yield Promise.resolve(value);
        }, DATA_ARRAY).then(function() {
            expect(newData).to.eql(DATA_ARRAY);
            done();
        }).catch(err => console.error(err));
    });

    it("loops through the given Array using a Function", function(done) {
        const newData = [];
        cf.forEachSerial(function (value, key) {
            newData[key] = value;
        }, DATA_ARRAY).then(function() {
            expect(newData).to.eql(DATA_ARRAY);
            done();
        }).catch(err => console.error(err));
    });

    it("loops through the given Object using a GeneratorFunction", function(done) {
        const newData = {};
        cf.forEachSerial(function* (value, key) {
            newData[key] = yield Promise.resolve(value);
        }, DATA_OBJECT).then(function() {
            expect(newData).to.eql(DATA_OBJECT);
            done();
        }).catch(err => console.error(err));
    });

    it("loops through the given Object using a Function", function(done) {
        const newData = {};
        cf.forEachSerial(function (value, key) {
            newData[key] = value;
        }, DATA_OBJECT).then(function() {
            expect(newData).to.eql(DATA_OBJECT);
            done();
        }).catch(err => console.error(err));
    });

});
