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
//     myVarName = 0;
//     stub('myVarName', 123, function(){
//         return assertEqual(myVarName,123);
//     });
//     // true
//
//     myVarName
//     // 0
//

// TODO: Create a single tmf function to encapsulate all functionality
// TODO: Use promises and chaining to use an API like the following:
//         tmf().stub('a', 1).assertEqual(function(){ return a === 1 });
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

        return f1 === f2;
    }

    scope.insistEqual = function(f1, f2, msg) {
        msg = msg || "Expected " + f1 + " to equal " + f2;
        return insist(assertEqual(f1, f2), msg);
    }

    function setVarOnScope(varName, value) {
        var oldVal,
            varDeclared = true; // will check below

        // detect if there is a reference to varName
        // i.e. differentiate between:
        // * declared var with no assignment (has reference)
        // * undeclared var (has no reference)
        try {
            // TODO: find alternative without using eval
            eval(varName);
        } catch (e) {
             if (e instanceof ReferenceError) {
                 varDeclared = false
             }
        };

        // save the old value to restore after function call
        if (varDeclared) {
            oldVal = scope[varName];
        }

        scope[varName] = value;

        return {
            varName     : varName,
            oldVal      : oldVal,
            varDeclared : varDeclared
        }
    }

    function restoreVarOnScope(o) {
        if (o.varDeclared) {
            // restore old value
            // will handle undefined values
            scope[o.varName] = o.oldVal;
        } else {
            // handle undeclared variables
            delete scope[o.varName];
        }
    }

    scope.stub = function(varName, value, fn, errFn) {
        var setVarInfo = setVarOnScope(varName, value),
            errToThrow,
            returnVal;

        try {
            returnVal = fn();
        } catch (e) {
            errToThrow = e;
        } finally {
            restoreVarOnScope(setVarInfo);

            if (errToThrow) {
                if (typeof errFn === "function") {
                    errFn(errToThrow, setVarInfo);
                } else {
                    throw errToThrow;
                }
            } else {
                 return returnVal;
            }
        }
    }
}(this));
