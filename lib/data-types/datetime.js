'use strict';

// Load modules

const _ = require('lodash');

// Declare internals

const internals = {};

/**
 * @param {String|Date} subject
 * @param {String} target
 * @returns {Boolean}
 */
module.exports.isMoreRecentThan = function (subject, target)
{
    return internals.getDatetimeFromFormat(target) <= new Date(subject);
};

/**
 * @param {String|Date} subject
 * @param {String} target
 * @returns {Boolean}
 */
module.exports.isLessRecentThan = function (subject, target)
{
    return internals.getDatetimeFromFormat(target) >= new Date(subject);
};

/**
 * @param {String} format
 * @returns {Date}
 */
internals.getDatetimeFromFormat = function (format)
{
    const formats = {
        Y: 31104000,
        M: 2592000,
        D: 86400,
        H: 3600,
        m: 60,
        s: 1
    },
        operator = format.charAt(0);

    let time_format = format.substr(1),
        time = 0;

    _.forEach(formats, (seconds, scale) =>
    {
        const data = _.split(time_format, scale);

        if (time_format.length !== data[0].length)
        {
            time += data[0] * seconds;
            time_format = data[1];
        }
    });

    return operator === '+'
        ? new Date((Date.now() + (time * 1000)))
        : new Date((Date.now() - (time * 1000)));
};