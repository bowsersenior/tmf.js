// tmf.js
// 2013-04-28

// Copyright (c) 2013 Mani Tadayon

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// The Software shall be used for Good, not Evil.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Usage:
//
//     assert(true)
//     // true
//
//     assert('foo')
//     // true
//
//     assert(false)
//     // false
//
//     assert('0')
//     // true
//
//     assert(0)
//     // false
//
//     assert(function(){ return true })
//     // true
//
//     assert(function(){ return false })
//     // false
//
//     insist(true)
//     // true
//
//     insist(false)
//     // ! "Assertion failed!"
//
//     insist(false, "My very own message!")
//     // ! "My very own message!"
//
//     insist(function(){ return true })
//     // true
//
//     insist(function(){ return false })
//     // ! "Assertion failed!"
//
//     a = [ {c: 123, d: [1,2] }, 4 ]
//     b = [ {c: 123, d: [1,2] }, 4 ]
//     a === b
//     // false (javascript issue with comparisons of arrays & objects)
//
//     assertEqual(a, b)
//     // true (uses JSON.stringify for comparison)
//
//     fooFn = function(){ return 'foo' };
//     assertEqual(fooFn, 'foo')
//     // true
//
//     insistEqual(fooFn, 'foo')
//     // true
//
//     insistEqual(fooFn, 'foos')
//     // ! "Expected function () { return 'foo'; } to equal foos"
//
//     insistEqual(fooFn, 'foos', "A custom message of your own choosing")
//     // ! "A custom message of your own choosing"
//
//     myVarName      = 0;
//     myOtherVarName = 0;
//     stub({myVarName: 123, myOtherVarName: 321}, function(){
//         return assertEqual( myVarName + myOtherVarName , 444);
//     })
//     // true
//
//     stub({myVarName: 1223, myOtherVarName: 321}, function(){
//         return insistEqual( myVarName + myOtherVarName , 1);
//     })
//     // ! "Expected 1544 to equal 1"
//
//     myVarName
//     // 0
//
//     myOtherVarName
//     // 0

// TODO: Add a testGroup function to organize tests
// TODO: Add a test runner to execute tests and output results
// TODO: Consider using a namespace to host all tmf functions
;(function(scope){
    "use strict";

    scope.assert = function(f){
        if (typeof f === "function") {
            return !! f();
        } else {
            return !! f;
        }
    };

    scope.insist = function(f, msg) {
        if ( assert(f) ) {
            return true;
        } else {
            msg = msg || "Assertion failed!";
            throw msg;
        }
    }

    scope.assertEqual = function(f1, f2) {
        if (typeof f1 === "function") {
            f1 = f1();
        }

        if (typeof f2 === "function") {
            f2 = f2();
        }

        return JSON.stringify(f1) === JSON.stringify(f2);
    }

    scope.insistEqual = function(f1, f2, msg) {
        msg = msg || "Expected " + f1 + " to equal " + f2;
        return insist(assertEqual(f1, f2), msg);
    }

    function setVarOnScope(name, value) {
        var oldVal,
            varDeclared = true; // will check below

        // detect if there is a reference to varName
        // i.e. differentiate between:
        // * declared var with no assignment (has reference)
        // * undeclared var (has no reference)
        try {
            // TODO: find alternative without using eval
            eval(name);
        } catch (e) {
             if (e instanceof ReferenceError) {
                 varDeclared = false
             }
        };

        // save the old value to restore after function call
        if (varDeclared) {
            oldVal = scope[name];
        }

        scope[name] = value;

        return {
            name     : name,
            value    : oldVal,
            declared : varDeclared
        }
    }

    function restoreVarOnScope(o) {
        if (o.declared) {
            // restore old value
            // will handle undefined values
            scope[o.name] = o.value;
        } else {
            // handle undeclared variables
            delete scope[o.name];
        }
    }

    scope.stub = function (o, fn, errFn) {
        var setVarInfo = [],
            errToThrow,
            returnVal,
            varName,
            i,
            n;

        for (varName in o) {
            if ( o.hasOwnProperty(varName) ) {
                setVarInfo.push(
                    setVarOnScope(varName, o[varName])
                );
            }
        };

        try {
            returnVal = fn();
        } catch (e) {
            errToThrow = e;
        } finally {
            for (i = 0, n = setVarInfo.length; i < n; i++) {
                restoreVarOnScope(setVarInfo[i]);
            }

            if (errToThrow) {
                if (typeof errFn === "function") {
                    errFn(errToThrow, o);
                } else {
                    throw errToThrow;
                }
            } else {
                 return returnVal;
            }
        }
    }
}(this));