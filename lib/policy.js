'use strict';

// Load modules

const _ = require('lodash');
const Fs = require('fs');
const Joi = require('joi');
const PolicySchema = require('./policy-schema');

// Declare internals

const internals = {
    attributes: {},
    rules: {}
};

/**
 * @param {Object} policy
 */
module.exports.load = function (policy)
{
    internals.validatePolicy(policy);

    internals.attributes = policy.attributes;
    internals.rules = policy.rules;
};

/**
 * @param {String[]} policy_paths
 */
module.exports.loadFile = function (policy_paths)
{
    let policy = {};
    
    _.forEach(policy_paths, path => policy = _.merge(policy, JSON.parse(Fs.readFileSync(path).toString())));

    internals.validatePolicy(policy);

    internals.attributes = policy.attributes;
    internals.rules = policy.rules;
};

/**
 * @returns {internals.rules|{}}
 */
module.exports.getAttributes = () => internals.attributes;

/**
 * @returns {internals.rules|{}}
 */
module.exports.getRules = () => internals.rules;

/**
 * @param {Object} policy
 */
internals.validatePolicy = function (policy)
{
    Joi.validate(policy, PolicySchema, err =>
    {
        if (err)
            throw err;
    });
};