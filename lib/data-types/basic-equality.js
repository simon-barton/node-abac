'use strict';

/**
 * @param {*} subject
 * @param {*} target
 * @returns {Boolean}
 */
module.exports.isStrictlyEqual = function (subject, target)
{
    return subject === target;
};

/**
 * @param {*} subject
 * @param {*} target
 * @returns {Boolean}
 */
module.exports.isEqual = function (subject, target)
{
    return subject == target;
};

/**
 * @param {*} subject
 * @param {*} target
 * @returns {Boolean}
 */
module.exports.isStrictlyNotEqual = function (subject, target)
{
    return subject !== target;
};

/**
 * @param {*} subject
 * @param {*} target
 * @returns {Boolean}
 */
module.exports.isNotEqual = function (subject, target)
{
    return subject != target;
};