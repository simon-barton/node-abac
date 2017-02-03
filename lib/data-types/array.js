'use strict';

// Load modules

const _ = require('lodash');

/**
 * @param {String|Number} needle
 * @param {Array} haystack
 * @returns {Boolean}
 */
module.exports.isIn = function (needle, haystack)
{
    return _.includes(haystack, needle)
};

/**
 * @param {String|Number} needle
 * @param {Array} haystack
 * @returns {Boolean}
 */
module.exports.isNotIn = function (needle, haystack)
{
    return !this.isIn(needle, haystack);
};

/**
 * @param {Array} array_1
 * @param {Array} array_2
 * @returns {Boolean}
 */
module.exports.intersect = function (array_1, array_2)
{
    return _.intersection(array_1, array_2).length > 0;
};

/**
 * @param {Array} array_1
 * @param {Array} array_2
 * @returns {Boolean}
 */
module.exports.doesNotIntersect = function (array_1, array_2)
{
    return !this.intersect(array_1, array_2);
};