// tmf.js
// 2013-03-13

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
//     insist(true)
//     // true
// 
//     insist(false)
//     // ! "Assertion failed!"
// 
//     insist(false, "My very own message!")
//     // ! "My very own message!"
// 
//     assertEqual(function(){ return 'foo' }, 'foo')
//     // true
// 
//     insistEqual(function(){ return 'foo' }, 'foo')
//     // true
// 
//     insistEqual(function(){ return 'foo' }, 'foos')
//     // ! "Expected function () { return 'foo'; } to equal foos"
// 
//     insistEqual(function(){ return 'foo' }, 'foos', "A custom message of your own choosing")
//     // ! "A custom message of your own choosing"

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
}(window));
