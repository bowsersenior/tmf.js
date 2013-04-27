tmf.js
======

tmf.js is a minimal testing tool for javascript

```javascript

// Usage:

assert(true)
// true

assert('foo')
// true

assert(false)
// false

assert('0')
// true

assert(0)
// false

assert(function(){ return true })
// true

assert(function(){ return false })
// false

insist(true)
// true

insist(false)
// ! "Assertion failed!"

insist(false, "My very own message!")
// ! "My very own message!"

insist(function(){ return true })
// true

insist(function(){ return false })
// ! "Assertion failed!"

fooFn = function(){ return 'foo' };
assertEqual(fooFn, 'foo')
// true

insistEqual(fooFn, 'foo')
// true

insistEqual(fooFn, 'foos')
// ! "Expected function () { return 'foo'; } to equal foos"

insistEqual(fooFn, 'foos', "A custom message of your own choosing")
// ! "A custom message of your own choosing"

myVarName = 0;
stub('myVarName', 123, function(){
    return assertEqual(myVarName,123);
});
// true

myVarName
// 0
```
