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
