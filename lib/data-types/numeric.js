'use strict';

// Load modules

const Basic = require('./basic-equality');

module.exports = Basic;

/**
 * @param {Number} subject
 * @param {Number} target
 * @returns {Boolean}
 */
module.exports.isGreaterThan = function (subject, target)
{
    return subject > target;
};

/**
 * @param {Number} subject
 * @param {Number} target
 * @returns {Boolean}
 */
module.exports.isGreaterThanEqualTo = function (subject, target)
{
    return subject >= target;
};

/**
 * @param {Number} subject
 * @param {Number} target
 * @returns {Boolean}
 */
module.exports.isLesserThan = function (subject, target)
{
    return subject < target;
};

/**
 * @param {Number} subject
 * @param {Number} target
 * @returns {Boolean}
 */
module.exports.isLesserThanEqualTo = function (subject, target)
{
    return subject <= target;
};