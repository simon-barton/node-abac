'use strict';

/**
 * @param {Number} subject
 * @param {Number} target
 * @returns {Boolean}
 */
module.exports.bitwiseAnd = function (subject, target)
{
    return (subject & target) > 0x000000;
};

/**
 * @param {Number} subject
 * @param {Number} target
 * @returns {Boolean}
 */
module.exports.bitwiseXor = function (subject, target)
{
    return (subject ^ target) > 0x000000;
};