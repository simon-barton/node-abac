'use strict';

/**
 * @param {Boolean} subject
 * @param {Boolean} target
 * @returns {Boolean}
 */
module.exports.boolAnd = function (subject, target)
{
    return subject && target;
};

/**
 * @param {Boolean} subject
 * @param {Boolean} target
 * @returns {Boolean}
 */
module.exports.boolIsEqual = function (subject, target)
{
    return subject === target;
};

/**
 * @param {Boolean} subject
 * @param {Boolean} target
 * @returns {Boolean}
 */
module.exports.boolOr = function (subject, target)
{
    return subject || target;
};