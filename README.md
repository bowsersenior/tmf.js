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

a = [ {c: 123, d: [1,2] }, 4 ]
b = [ {c: 123, d: [1,2] }, 4 ]
a === b
// false (javascript issue with comparisons of arrays & objects)

assertEqual(a, b)
// true (uses JSON.stringify for comparison)

fooFn = function(){ return 'foo' };
assertEqual(fooFn, 'foo')
// true

insistEqual(fooFn, 'foo')
// true

insistEqual(fooFn, 'notfoo')
// ! "Expected function () { return 'foo'; } to equal notfoo"

insistEqual(fooFn, 'notfoo', "A custom message of your own choosing")
// ! "A custom message of your own choosing"

myVarName      = 0;
myOtherVarName = 0;
stub({myVarName: 'foo', myOtherVarName: 'bar'}, function(){
    return assertEqual( myVarName + myOtherVarName , 'foobar');
})
// true

stub({myVarName: 'foo', myOtherVarName: 'bar'}, function(){
    return insistEqual( myVarName + myOtherVarName , 1);
})
// ! "Expected foobar to equal 1"

myVarName
// 0

myOtherVarName
// 0
```
