node-abac
========

### Node.js Attributes Based Access Control library

[![npm version](https://badge.fury.io/js/node-abac.svg)](https://badge.fury.io/js/node-abac)

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

Policies can be read from one or more JSON files

```javascript
const Abac = new NodeAbac(['path/to/policy.json', 'another/path/policy2.json']);
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

## Usage

TODO

For more comparison usage please refer to the [dedicated comparisons documentation](doc/comparisons.md).