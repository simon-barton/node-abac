Comparisons
==========

A policy rule specifies expected values for each attribute bases on a defined comparison. Using this 
comparison the library is able to determine if the attribute matches the expected value and passes the rule.

Numeric
-------

* isGreaterThan (>)
* isGreaterThanEqualTo (>=)
* isLesserThan (<)
* isLesserThanEqualTo (<=)

String
------

* isStrictlyEqual (===)
* isEqual (==)
* isStrictlyNotEqual (!==)
* isNotEqual (!=)

Datetime
----

* isMoreRecentThan
* isLessRecentThan

Array
-----

* isIn
* isNotIn
* intersect
* doesNotIntersect

Boolean
------

* boolAnd (&&)
* boolIsEqual (===)
* boolOr (||)

Bitwise
------

* bitwiseAnd (&)
* bitwiseXor (^)