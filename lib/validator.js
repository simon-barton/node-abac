'use strict';

// Load modules

const _ = require('lodash');
const Comparator = require('./comparator');

// Declare internals

const internals = {};

/**
 * @param {Policy} policy
 */
module.exports = internals.Validator = function (policy)
{
    this._policy = policy;
};

/**
 * @param {Object} rule_name
 * @param {Object} subject
 * @param {Object} resource
 * @return {Object[]}
 */
internals.Validator.prototype.validate = function (rule_name, subject, resource)
{
    const self = this,
        objects = _.merge({}, subject, resource),
        rule = self._policy.getRules()[rule_name];

    let results = [];

    _.forEach(rule.attributes, (criteria, object_attribute) =>
    {
        const [object, attribute] = _.split(object_attribute, /\.(.+)/, 2),
            type = criteria.comparison_type,
            mode = criteria.comparison,
            object_value = _.get(objects[object], attribute);
        
        let comparison_result,
            criteria_value,
            field_value;

        if (criteria.hasOwnProperty('field'))
        {
            criteria_value = _.get(objects[criteria.comparison_target], criteria.field);
            field_value = criteria_value;
        }
        else
            criteria_value = criteria.value;

        comparison_result = Comparator.compare(type, mode, object_value, criteria_value);

        results.push({
            criteria: criteria,
            field_value: field_value,
            result: comparison_result,
            subject: object,
            subject_attribute: attribute,
            subject_value: object_value
        });
    });

    if (rule.hasOwnProperty('rules'))
        _.forEach(rule.rules, sub_rule_name => results = _.concat(results, self.validate(sub_rule_name, subject, resource)));

    if (rule.hasOwnProperty('anyRules')) {
        let failedSubResults = [];
        let successSubResults = [];
        _.forEach(rule.anyRules, sub_rule_name => {
            let subResult = self.validate(sub_rule_name, subject, resource);
            const denies = _.filter(subResult, ['result', false]);
            if (_.isEmpty(denies)) {
                successSubResults = _.concat(successSubResults, subResult);
            } else {
                failedSubResults = _.concat(failedSubResults, subResult);
            }
        });

        if (!_.isEmpty(successSubResults))
            results = _.concat(results, successSubResults);
        else
            results = _.concat(results, failedSubResults);
    }

    return results;
};

/**
 * @param {String} rule_name
 * @param {Object[]} denies
 */
internals.Validator.prototype.formatDeny = function (rule_name, denies)
{
    const error = {
        msg: rule_name + ' DENIED',
        errors: []
    },
        attributes = this._policy.getAttributes();

    _.forEach(denies, deny =>
    {
        let expected;

        if (deny.criteria.hasOwnProperty('field'))
            expected = deny.field_value;
        else
            expected = deny.criteria.value;

        if (_.isArray(expected))
            expected = _.join(expected, '|');

        error.errors.push({
            msg: deny.criteria.comparison_type + ' value \'' + attributes[deny.subject][deny.subject_attribute] +
                '\' failed to pass ' + deny.criteria.comparison,
            expected: expected,
            actual: deny.subject_value
        });
    });

    return error;
};