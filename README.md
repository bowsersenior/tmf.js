tmf.js
======

tmf.js is a minimal testing tool for javascript

## Usage:
```javascript
tmf.assert(true)
// true

tmf.assert('foo')
// true

tmf.assert(false)   // throws an error
// ! "Assertion failed!"

tmf.assert('0')
// true

tmf.assert(0)
// ! "Assertion failed!"

tmf.assert(function(){ return true })
// true

tmf.assert(function(){ return false })
// ! "Assertion failed!"

// set a custom error message
tmf.assert(false, "My very own message!")
// ! "My very own message!"

a = [ {c: 123, d: [1,2] }, 4 ]
b = [ {c: 123, d: [1,2] }, 4 ]
a === b
// false (javascript issue with comparisons of arrays & objects)

tmf.assertEqual(a, b)
// true (uses JSON.stringify for comparison)

fooFn = function(){ return 'foo' };
tmf.assertEqual(fooFn, 'foo')
// true

tmf.assertEqual(fooFn, 'foos')
// ! "Expected function () { return 'foo'; } to equal foos"

tmf.assertEqual(fooFn, 'foos', "A custom message of your own choosing")
// ! "A custom message of your own choosing"

myVarName      = 0;
myOtherVarName = 0;
tmf.stub({myVarName: 123, myOtherVarName: 321}, function(){
    return tmf.assertEqual( myVarName + myOtherVarName , 444);
})
// true

tmf.stub({myVarName: 1223, myOtherVarName: 321}, function(){
    return assertEqual( myVarName + myOtherVarName , 1);
})
// ! "Expected 1544 to equal 1"

myVarName
// 0

myOtherVarName
// 0
```
