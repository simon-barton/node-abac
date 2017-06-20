node-abac
========

### Node.js Attributes Based Access Control library

[![npm version](https://badge.fury.io/js/node-abac.svg)](https://www.npmjs.com/package/node-abac) 
[![npm](https://img.shields.io/npm/dt/node-abac.svg)](https://www.npmjs.com/package/node-abac) 
[![npm](https://img.shields.io/npm/l/node-abac.svg)](LICENSE)

This library is designed to help implement the concept of Attribute Based Access Control (ABAC) in your Node.js applications 
using simple `JSON` policies.

For more information on ABAC consider reading the [NIST Specification Guide](http://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.sp.800-162.pdf).

Inspired by [php-abac](https://github.com/Kilix/php-abac)

## Installation

Install the latest stable release with the npm command-line tool:

```bash
$ npm install node-abac
```

## Configuration

Import the library

```javascript
const NodeAbac = require('node-abac');
```

#### Policies

Policies can be read from one or more files. Both JSON and YAML structures are supported and can be mixed if desired.

```javascript
const Abac = new NodeAbac('path/to/policy.json');
const Abac = new NodeAbac(['path/to/policy.json', 'another/path/policy2.yml']);
```

Or passed directly in as a JavaScript object

```javascript
const myPolicy = {
    attributes: {
        user: {
            hasDrivingLicense: "Possesses driving license"
        }
    },
    rules: {
        "can-drive": {
            attributes: {
                "user.hasDrivingLicense": {
                    comparison_type: "boolean",
                    comparison: "booleanAnd",
                    value: true
                }
            }
        }
    }
};

const Abac = new NodeAbac(myPolicy);
```

#### Error messages

Descriptive enforcement errors can be toggled on or off globally using a second parameter to `NodeAbac`. By default they're disabled
so failed enforcements will simply return `false`. For example:

```json
{
  "msg": "can-be-admin DENIED",
  "errors": [
    {
      "msg": "numeric value 'Times banned' failed to pass isLesserThanEqualTo",
      "expected": 1,
      "actual": 2
    },
    {
      "msg": "array value 'Origin' failed to pass isIn",
      "expected": "FR|DE|IT|L|GB|P|ES|NL|B",
      "actual": "PL"
    }
  ]
}
```

To enable globally

```javascript
const Abac = new NodeAbac(myPolicy, true);
```
Alternatively this global flag can be overwritten on individual enforcement calls by using the fourth parameter `verbose_error`.

```javascript
const Abac = new NodeAbac(myPolicy); // verbose_errors globally off
const mySubject = {};
const myResource = {};

...

const result = Abac.enforce('my-rule', mySubject, myResource, true); // verbose_error on for this call only
```

## Usage

This library simply consists of two functions to integrate ABAC into your application.
 
* [`getRuleAttributes(rule)`](#getRuleAttributes)
* [`enforce(rule_name, subject, resource = {}, verbose_error = false)`](#enforce)

### `getRuleAttributes`

`getRuleAttributes` is used to inspect a rule for its required objects and their fields. The response is typically used to make further 
requests to a Policy Information Point (PIP).

Given the policy with a rule `can-be-admin-of-group`: for a user to become admin of a group they must me active, over 21 years old, been banned no more than once
and be in the group that they're attempting to administer.

```json
{
    "attributes": {
        "user": {
            "active": "Active",
            "banCount": "Times banned",
            "dob": "Date of birth",
            "group": "Group ID"
        },
        "group": {
            "id": "Group ID"
        }
    },
    "rules": {
        "can-be-admin-of-group": {
            "attributes": {
                "user.active": {
                    "comparison_type": "boolean",
                    "comparison": "boolAnd",
                    "value": true
                },
                "user.dob": {
                    "comparison_type": "datetime",
                    "comparison": "isLessRecentThan",
                    "value": "-21Y"
                },
                "user.banCount": {
                    "comparison_type": "numeric",
                    "comparison": "isLesserThanEqualTo",
                    "value": 1
                },
                "user.group": {
                    "comparison_target": "group",
                    "comparison_type": "numeric",
                    "comparison": "isStrictlyEqual",
                    "field": "id"
                }
            }
        }
    }
}
```

Calling `getRuleAttributes('can-be-admin-of-group')` will return our required fields to fulfill the rule.

```json
{
    "user": [
        "active",
        "dob",
        "banCount",
        "group"
    ],
    "group": [
        "id"
    ]
}
```

This tells us our `subject` is `user` and the `resource` is `group`.

### `enforce`

`enforce` is the point at which a permit or deny decision is made. It must be called with a rule name and subject and can optionally accept 
a resource that the rule is protecting.

To continue the above example consider the scenario where we have acquired our attribute data and want to check the user can administer the group.

```javascript
let subject = {
    user: {
        active: true,
        dob: '1991-05-12',
        banCount: 0,
        group: 12
    }
};
let resource = {
    group: {
        id: 12
    }
};

const permit = Abac.enforce('can-be-admin-of-group', subject, resource); // returns true

subject = {
    user: {
        active: true,
        dob: '2006-05-12', // too young
        banCount: 4, // banned too many times
        group: 12
    }
};
resource = {
    group: {
        id: 12
    }
};

const deny = Abac.enforce('can-be-admin-of-group', subject, resource); // returns false || error message
```

### Comparisons

For more information on comparison usage please refer to the [dedicated comparisons documentation](doc/comparisons.md).

## Coming Soon

* Additional documentation and examples
* Testing
* Additional datatype operations