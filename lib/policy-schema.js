'use strict';

// Load modules

const Joi = require('joi');

// Declare internals

const internals = {};

/**
 * @type {Joi.ObjectSchema}
 */
internals.attributes = Joi.object()
    .pattern(/[\w-]/, Joi.object()
        .pattern(/[\w-]/, Joi.alternatives().try(Joi.number(), Joi.string())));

/**
 * @type {Joi.ObjectSchema}
 */
internals.rule = Joi.object().keys(
    {
        attributes: Joi.object().pattern(/[\w-]/, Joi.object().keys(
            {
                comparison: Joi.string(),
                comparison_target: Joi.string().optional(),
                comparison_type: Joi.string(),
                field: Joi.string().optional(),
                value: Joi.any().optional()
            }
        )),
        rules: Joi.array().items(Joi.string()).optional(),
        anyRules: Joi.array().items(Joi.string()).optional()
    }
);

/**
 * @type {Joi.ObjectSchema}
 */
internals.rules = Joi.object()
    .pattern(/[\w-]/, Joi.alternatives().try(internals.rule, Joi.array().items(internals.rule)));

/**
 * @type {Joi.ObjectSchema}
 */
module.exports = Joi.object().keys(
    {
        attributes: internals.attributes,
        rules: internals.rules
    }
);