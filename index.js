'use strict';

const map = require('./lib/map');
const filter = require('./lib/filter');
const forEach = require('./lib/for-each');
const reduce = require('./lib/reduce');
const compose = require('./lib/compose');
const bind = require('./lib/bind');

module.exports = {
    map: map.map,
    mapSerial: map.mapSerial,
    filter: filter.filter,
    filterSerial: filter.filterSerial,
    forEach: forEach.forEach,
    forEachSerial: forEach.forEachSerial,
    reduce: reduce.reduce,
    compose: compose.compose,
    bind: bind.bind,
    lazyBind: bind.lazyBind
};
