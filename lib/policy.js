'use strict';

// Load modules

const _ = require('lodash');
const Fs = require('fs');
const Joi = require('joi');
const Path = require('path');
const PolicySchema = require('./policy-schema');
const Yaml = require('js-yaml');

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
 * @param {String|String[]} policy_paths
 */
module.exports.loadFile = function (policy_paths)
{
    if (typeof policy_paths === 'string')
        policy_paths = [policy_paths];

    let policy = {},
        fileContent;
    
    _.forEach(policy_paths, path =>
    {
        switch (Path.extname(path))
        {
            case '.json':
                fileContent = JSON.parse(Fs.readFileSync(path).toString());
                break;
            case '.yml':
                fileContent = Yaml.safeLoad(Fs.readFileSync(path, 'utf8'),
                    { json: true, schema: Yaml.JSON_SCHEMA });
                break;
            default:
                fileContent = {};
        }

        policy = _.merge(policy, fileContent);
    });

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