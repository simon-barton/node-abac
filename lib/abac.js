'use strict';

// Load modules

const _ = require('lodash');
const Policy = require('./policy');
const Validator = require('./validator');

// Declare internals

const internals = {};

/**
 * @param {String[]|Object} policy_paths
 * @param {Boolean} verbose_errors
 * @param {Object} policy
 */
module.exports = internals.Abac = function (policy, verbose_errors = false)
{
    if (_.isArray(policy))
        Policy.loadFile(policy);
    else if (_.isObject(policy))
        Policy.load(policy);
    else
        throw new Error('Invalid policy format, expected array of file paths or JSON object');

    this._validator = new Validator(Policy);
    this._verbose_errors = verbose_errors;
};

/**
 * @param {String} rule_name
 * @param {Object} subject
 * @param {Object} resource
 * @param {Boolean} verbose_error
 * @returns {Boolean}
 */
internals.Abac.prototype.enforce = function (rule_name, subject, resource = {}, verbose_error = false)
{
    const validate_result = this._validator.validate(rule_name, subject, resource);

    const denies = _.filter(validate_result, ['result', false]);

    if (_.isEmpty(denies))
        return true;

    if (this._verbose_errors || verbose_error)
        return this._validator.formatDeny(rule_name, denies);

    return false;
};

/**
 * Return the user/resource attributes required to enforce a rule
 *
 * @param {String} rule_name
 * @returns {Object}
 */
internals.Abac.prototype.getRuleAttributes = function (rule_name)
{
    const rule = Policy.getRules()[rule_name];

    let rule_attributes = {};

    if (_.isArray(rule))
        _.forEach(rule, criteria => rule_attributes = _.merge(rule_attributes, internals.getAttributes(criteria.attributes)));
    else
        rule_attributes = internals.getAttributes(rule.attributes);

    if (rule.hasOwnProperty('rules'))
        _.forEach(rule.rules, sub_rule_name =>
        {
            const sub_rule_attributes = this.getRuleAttributes(sub_rule_name);

            _.forEach(sub_rule_attributes, (attributes, object) =>
            {
                if (!rule_attributes.hasOwnProperty(object))
                    rule_attributes[object] = [];

                rule_attributes[object] = _.uniq(_.concat(rule_attributes[object], attributes));
            });
        });

    if (rule.hasOwnProperty('anyRules')) {
        _.forEach(rule.anyRules, sub_rule_name =>
            {
                const sub_rule_attributes = this.getRuleAttributes(sub_rule_name);
    
                _.forEach(sub_rule_attributes, (attributes, object) =>
                {
                    if (!rule_attributes.hasOwnProperty(object))
                        rule_attributes[object] = [];
    
                    rule_attributes[object] = _.uniq(_.concat(rule_attributes[object], attributes));
                });
            });
    }

    if (_.keys(rule_attributes).length > 2)
        throw new Error('Rules can only apply to a maximum of one subject and one resource. "' + rule_name +
            '" requires ' + _.join(_.keys(rule_attributes), ', '));

    return rule_attributes;
};

/**
 * @param {Object} attributes
 * @returns {Object}
 */
internals.getAttributes = function (attributes)
{
    let rule_attributes = {};

    _.forEach(attributes, (criteria, object_attribute) =>
    {
        let [object, attribute] = _.split(object_attribute, '.', 2);

        if (!rule_attributes.hasOwnProperty(object))
            rule_attributes[object] = [];

        if (!_.includes(rule_attributes[object], attribute))
            rule_attributes[object].push(attribute);

        if (criteria.hasOwnProperty('field'))
        {
            if (!rule_attributes.hasOwnProperty(criteria.comparison_target))
                rule_attributes[criteria.comparison_target] = [];

            if (!_.includes(rule_attributes[criteria.comparison_target], criteria.field))
                rule_attributes[criteria.comparison_target].push(criteria.field);
        }
    });

    return rule_attributes;
};