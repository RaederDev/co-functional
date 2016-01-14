const expect = require('chai').expect;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const should = require('chai').should();
const cf = require('../index');

chai.use(chaiAsPromised);

describe("compose", function() {

    const TEST_NUMBER = 3;
    const TEST_NUMBER_2 = 4;

    it("should compose the given functions and return the result", function() {
        return cf.compose(
            function (n) {
                return Promise.resolve(n + 1);
            },
            function* (n) {
                return yield Promise.resolve(n + 1)
            },
            function (n) {
                return n + 1;
            }
        )(0).should.eventually.equal(TEST_NUMBER);
    });

    it("should compose the given functions and allow for multiple arguments and return the result", function() {
        return cf.compose(
            function (n) {
                return Promise.resolve(n + 1);
            },
            function* (n) {
                return yield Promise.resolve(n + 1)
            },
            function (a, b) {
                return a + b;
            }
        )(1, 1).should.eventually.equal(TEST_NUMBER_2);
    });

});
