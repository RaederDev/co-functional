const expect = require('chai').expect;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = require('chai').should();
const cf = require('../index');

chai.use(chaiAsPromised);

const TEST_NUMBER = 1234;
const TEST_STRING_1 = 'A';
const TEST_STRING_2 = 'B';
const TEST_OBJECT = {
    prop: TEST_NUMBER
};

describe("bind", function() {

    it("takes one argument and returns a function", function() {
        const result = cf.bind(function* () {});
        return expect(result).to.be.a('function');
    });

    it("binds the given GeneratorFunction to the given context", function() {
        return cf.bind(function* () {
            return this.prop;
        }, TEST_OBJECT).should.eventually.equal(TEST_NUMBER);
    });

    it("binds the given GeneratorFunction to the given context and passes arguments to the function", function() {
        const result = TEST_STRING_1 + TEST_STRING_2 + TEST_NUMBER;
        return cf.bind(function* (arg1, arg2) {
            return arg1 + arg2 + this.prop;
        }, TEST_OBJECT, TEST_STRING_1, TEST_STRING_2).should.eventually.equal(result);
    });

    it("binds the given Function to the given context", function() {
        return cf.bind(function() {
            return this.prop;
        }, TEST_OBJECT).should.eventually.equal(TEST_NUMBER);
    });

    it("binds the given Function to the given context and passes arguments to the function", function() {
        const result = TEST_STRING_1 + TEST_STRING_2 + TEST_NUMBER;
        return cf.bind(function(arg1, arg2) {
            return arg1 + arg2 + this.prop;
        }, TEST_OBJECT, TEST_STRING_1, TEST_STRING_2).should.eventually.equal(result);
    });

});

describe("lazyBind", function() {

    it("takes one argument and returns a function", function() {
        const result = cf.lazyBind(function* () {});
        return expect(result).to.be.a('function');
    });

    it("binds the given GeneratorFunction to the given context", function() {
        return cf.lazyBind(function* () {
            return this.prop;
        }, TEST_OBJECT)().should.eventually.equal(TEST_NUMBER);
    });

    it("returns a function wrapper that waits to be executed and when executed is bound to the given context", function() {
        const result = cf.lazyBind(function* () {
            return this.prop;
        }, TEST_OBJECT);
        expect(result).to.be.a('function');
        return result().should.eventually.equal(TEST_NUMBER);
    });

    it("binds the given GeneratorFunction to the given context and passes arguments to the function", function() {
        const result = TEST_STRING_1 + TEST_STRING_2 + TEST_NUMBER;
        return cf.lazyBind(function* (arg1, arg2) {
            return arg1 + arg2 + this.prop;
        }, TEST_OBJECT)(TEST_STRING_1, TEST_STRING_2).should.eventually.equal(result);
    });

    it("binds the given Function to the given context and passes arguments to the function", function() {
        const result = TEST_STRING_1 + TEST_STRING_2 + TEST_NUMBER;
        return cf.lazyBind(function (arg1, arg2) {
            return arg1 + arg2 + this.prop;
        }, TEST_OBJECT)(TEST_STRING_1, TEST_STRING_2).should.eventually.equal(result);
    });

});