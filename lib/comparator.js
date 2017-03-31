'use strict';

// Declare internals

const internals = {
    array: require('./data-types/array'),
    bitwise: require('./data-types/bitwise'),
    boolean: require('./data-types/boolean'),
    datetime: require('./data-types/datetime'),
    numeric: require('./data-types/numeric'),
    string: require('./data-types/string')
};

/**
 * @param {String} type
 * @param {String} mode
 * @param {*} object_value
 * @param {*} criteria_value
 * @return {Boolean}
 */
module.exports.compare = function (type, mode, object_value, criteria_value)
{
    return internals[type][mode](object_value, criteria_value)
};
