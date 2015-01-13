(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],2:[function(require,module,exports){
function suppressEvent (event) {
    event.stopPropagation();
    event.preventDefault();
}

module.exports = {

    bindMenuHandlers: function (game) {
        $('a[href="#newgame"]').click(function (event) {
            suppressEvent(event);
            game.newGame();
        });

        $('a[href="#restart"]').click(function (event) {
            suppressEvent(event);
            game.restart();
        });

        $('a[href="#undo"]').click(function (event) {
            suppressEvent(event);
            game.undoAction();
        });
    },

    bindDocumentEventHandlers: function (drag) {
        var doc = $(document);
        doc.mouseup(function (ev) {
            drag.stop(ev.pageX, ev.pageY);
        });
        doc.mousemove(function (ev) {
            drag.update(ev.pageX, ev.pageY);
        });
    },

    bindCardEventHandlers: function (click, drag) {
        var cardDivs = $('.card');

        cardDivs.dblclick(function () {
            return click.doubleClickCard(this.card);
        });

        cardDivs.mousedown(function (ev) {
            return drag.start(this.card, ev.pageX, ev.pageY);
        });

        cardDivs.click(function () {
            return click.singleClickCard(this.card);
        });

        cardDivs.bind('contextmenu', function () {
            return false;
        });
    }
};

},{}],3:[function(require,module,exports){
var _ = require('../../server/public/libs/underscore.js');


module.exports = {

    countOf: function (list, predicate) {
        return _.filter(list, predicate).length;
    },

    isShowing: function (card) {
        return !!card.faceUp;
    },

    isSameSuit: function (cardA, cardB) {
        return cardA.suit === cardB.suit;
    },

    isDifferentColor: function (cardA, cardB) {
        return cardA.color !== cardB.color;
    },

    isOneLessThan: function (cardA, cardB) {
        return cardA.rank === cardB.rank - 1;
    },

    isOneMoreThan: function (cardA, cardB) {
        return cardA.rank === cardB.rank + 1;
    },

    isWithin: function (pile, card) {
        return _.contains(_.flatten(pile), card);
    },

    isTopCardOf: function (pile, card) {
        return _.last(pile) === card;
    }
};

},{"../../server/public/libs/underscore.js":1}],4:[function(require,module,exports){
var _ = require('../../server/public/libs/underscore.js');

var ACE = 1,
    JACK = 11,
    QUEEN = 12,
    KING = 13;

var HEARTS = 'hearts',
    CLUBS = 'clubs',
    DIAMONDS = 'diamonds',
    SPADES = 'spades';

var COLOR = {
    RED: 'red',
    BLACK: 'black'
};

var SUITS = [ HEARTS, CLUBS, DIAMONDS, SPADES ];
var CARD_VALUES = [ ACE, 2, 3, 4, 5, 6, 7, 8, 9, 10, JACK, QUEEN, KING ];


function determineColor (suit) {
    switch (suit) {
        case HEARTS:
        case DIAMONDS:
            return COLOR.RED;

        case CLUBS:
        case SPADES:
            return COLOR.BLACK;
    }
}

function PlayingCard (suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.color = determineColor(suit);
    this.faceUp = false;
}

function createCard (suit, rank) {
    return new PlayingCard (suit, rank);
}

function createSuit (suit) {
    return _.map(CARD_VALUES, function (rank) {
        return createCard(suit, rank);
    });
}

function createDeck (suits) {
    return _.flatten(_.map(suits, createSuit));
}


module.exports = {
    createDeck: createDeck,
    createCard: createCard,
    SUITS: SUITS,
    ACE: ACE,
    KING: KING
};

},{"../../server/public/libs/underscore.js":1}],5:[function(require,module,exports){
// duplicated in render
function getPosition (element) {
    var wrap = $(element);
    return {
        top: parseFloat(wrap.css('top')),
        left: parseFloat(wrap.css('left'))
    };
}

// duplicated in render
function setZIndex (element, value) {
    return $(element).css('z-index', value);
}


function Drag (render, game, board, check) {
    var cardWidth = 70,
        cardHeight = 98;

    var cardsInHand = [];
    var mousePosition = { x: 0, y: 0 };


    function getDragCards (card, pile) {
        var index = _.indexOf(pile, card);
        return pile.slice(index);
    }

    function calculateOverlap (aMin, aMax, bMin, bMax) {
        if ( (aMin > bMax) || (aMax < bMin) ) {
            return 0;
        } else {
            var aDiff = Math.max(aMin, bMin),
                bDiff = Math.min(aMax, bMax);
            return bDiff - aDiff;
        }
    }

    function boundingBox (card) {
        var position = getPosition(card.element);
        position.bottom = position.top + cardHeight;
        position.right = position.left + cardWidth;
        return position;
    }

    function boundingBoxTableau (container) {
        var baseArea = boundingBox(container);
        var offset = Math.max(container.pile.length - 1, 0);

        baseArea.top = baseArea.top + offset * 25;
        baseArea.bottom = baseArea.bottom + offset * 25;

        return baseArea;
    }

    function findOverlapArea (container, card) {
        var cardBox = boundingBox(card),
            handBox = boundingBoxTableau(container);

        var hDiff = calculateOverlap(cardBox.left, cardBox.right, handBox.left, handBox.right);
        var vDiff = calculateOverlap(cardBox.top, cardBox.bottom, handBox.top, handBox.bottom);

        return hDiff * vDiff;
    }

    function getHitTargets (card) {
        function isValidTargetForCard(container) {
            if (_.contains(container.pile, card)) {
                return true;
            }
            return container.allowsCard(card);
        }

        function pairWithOverlap (container) {
            return { container: container, overlap: findOverlapArea(container, card) };
        }
        function hasPositiveOverlap (target) { return target.overlap > 0; }

        return _.chain(board.allContainers()).
            filter(isValidTargetForCard).
            map(pairWithOverlap).
            filter(hasPositiveOverlap).
            pluck('container').
            sortBy('overlap').
            reverse().
            value();
    }


    this.start = function (card, x, y) {
        if (check.isDraggable(card, card.container)) {
            cardsInHand = getDragCards(card, card.container);
            var someHighNumber = 300;

            _.each(cardsInHand, function (card, index) {
                setZIndex(card.element, index + someHighNumber);
            });

            mousePosition = { x: x, y: y };
        } else {
            cardsInHand = [];
        }
    };

    this.update = function (x, y) {
        if (!_.isEmpty(cardsInHand)) {
            var dx = x - mousePosition.x;
            var dy = y - mousePosition.y;
            mousePosition = { x: x, y: y };
            render.moveCardsByDelta(cardsInHand, dx, dy);
        }
    };

    this.stop = function () {
        if (!_.isEmpty(cardsInHand)) {
            var hitTargets = getHitTargets(_.first(cardsInHand));

            if (!_.isEmpty(hitTargets)) {
                var container = _.first(hitTargets);
                var action = container.dropAction(cardsInHand);
                game.storeAction(action);
            } else {
                // move card back to container
                var card = _.first(cardsInHand);
                render.forceUpdate(card.container);
            }
        }
        cardsInHand = [];
    };
}

module.exports = Drag;

},{}],6:[function(require,module,exports){
function Game (deal, render, undo) {

    this.newGame = function () {
        undo.clear();
        deal();
        render.everything();
    };

    this.restart = function () {
        undo.all();
        render.everything();
    };

    this.undoAction = function () {
        var record = undo.once();
        render.everything(record);
    };

    this.storeAction = function (record) {
        undo.store(record);
        render.everything(record);
    };
}

module.exports = Game;

},{}],7:[function(require,module,exports){
function spreadDown (base, index) {
    return { top: base.top + (25 * index), left: base.left };
}

function stacked (base, index) {
    var offset = Math.floor(Math.max(0, index) / 3);
    return { top: base.top - offset, left: base.left + offset };
}

function stackedTopSpread (base, index, limit) {
    var stackedBase, offset;
    if (limit < 4) {
        // all cards are spread cards
        offset = 20 * index;
        return { top: base.top, left: base.left + offset };
    } else {
        if (index < limit - 2) {
            // not a spread card
            stackedBase = stacked(base, index);
            return { top: stackedBase.top, left: stackedBase.left };
        } else {
            stackedBase = stacked(base, limit - 3);
            offset = 20 * (index + 3 - limit);
            return { top: stackedBase.top, left: stackedBase.left + offset };
        }
    }
}

module.exports = {
    spreadDown: spreadDown,
    stacked: stacked,
    stackedTopSpread: stackedTopSpread
};

},{}],8:[function(require,module,exports){
// duplicated in drag
function getPosition (element) {
    var wrap = $(element);
    return {
        top: parseFloat(wrap.css('top')),
        left: parseFloat(wrap.css('left'))
    };
}

// duplicated in drag
function setZIndex (element, value) {
    return $(element).css('z-index', value);
}


function Render (board, check) {
    "use strict";

    var ANIMATION_MS = 100;

    function applyFlipped (card) {
        var element = $(card.element);
        var cardClass = card.suit + card.rank;
        if (card.faceUp) {
            element.removeClass('flipped');
            element.addClass(cardClass);
        } else {
            element.addClass('flipped');
            element.removeClass(cardClass);
        }
    }

    function setCardCursor (card) {
        if (check.isClickable(card)) {
            $(card.element).css('cursor', 'pointer');
        } else {
            $(card.element).css('cursor', 'auto');
        }
    }

    function setPosition (element, top, left) {
        return $(element).css({
            top: top,
            left: left
        });
    }

    function animateMove (card, target, callback) {
        $(card.element).animate(
            target, {
                complete: function () { callback(); },
                duration: ANIMATION_MS,
                queue: false
            }
        );
    }

    function animateFlip (card) {
        var pos = getPosition(card.element);
        var toLeft = { left: pos.left + 7 };
        var origin = { left: pos.left };

        $(card.element).animate(
            toLeft,
            ANIMATION_MS / 2,
            function () { applyFlipped(card); }
        ).animate(
            origin,
            ANIMATION_MS / 2
        );
    }

    function renderContainerContent (container) {
        var basePosition = getPosition(container.element);
        var layoutFunc = _.partial(container.layout, basePosition);
        var limit = container.pile.length;

        _.each(container.pile, function (card, index) {
            setZIndex(card.element, index);

            var currentPosition = getPosition(card.element),
                targetPosition = layoutFunc(index, limit);

            var topDiff = targetPosition.top - currentPosition.top,
                leftDiff = targetPosition.left - currentPosition.left;

            var elementIsFaceUp = !_.contains(card.element.classList, 'flipped');
            var cardIsFaceUp = card.faceUp;
            var requiresFlip;

            if (cardIsFaceUp === elementIsFaceUp) {
                requiresFlip = false;
            } else {
                requiresFlip = true;
            }


            if (topDiff !== 0 || leftDiff !== 0) {
                // arbitrary large number; greater than card deck length
                setZIndex(card.element, 300 + index);
                applyFlipped(card);

                animateMove(card, targetPosition, function () {
                    setZIndex(card.element, index);
                });
            } else if (requiresFlip) {
                animateFlip(card);
            } else {
                applyFlipped(card);
            }

            setCardCursor(card);
        });
    }


    this.everything = function (callback) {
        _.each(board.allContainers(), renderContainerContent);
        if (_.isFunction(callback)) {
            setTimeout(callback, ANIMATION_MS);
        }
    };

    this.renderAction = function (parts) {
        var affectedOrigins = _.pluck(parts, 'origin'),
            affectedTargets = _.pluck(parts, 'target'),
            affectedPiles = affectedOrigins.concat(affectedTargets);

        var affectedContainers = _.chain(affectedPiles).
            uniq().
            map(board.containerForPile).
            compact().
            value();

        _.each(affectedContainers, renderContainerContent);
    };

    this.forceUpdate = function (pile) {
        var container = board.containerForPile(pile);
        renderContainerContent(container);
    };

    this.moveCardsByDelta = function (cards, dx, dy) {
        _.each(cards, function (card) {
            setPosition(card.element, '+=' + dy, '+=' + dx);
        });
    };
}

module.exports = Render;

},{}],9:[function(require,module,exports){
function shuffle (array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m);
        m--;
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

module.exports = shuffle;

},{}],10:[function(require,module,exports){
// duplicated in actions
function flipCard (card) {
    card.faceUp = !card.faceUp;
}

function undoActionPart (part) {
    if (part.target) {
        var cardIndex = _.indexOf(part.target, part.card);
        if (cardIndex > -1) {
            var card = _.first(part.target.splice(cardIndex, 1));
            part.origin.push(card);
            card.container = part.origin;
        }
    }
    if (part.flip) { flipCard(part.card); }
}

function undoAction (action) {
    _.each(action.reverse(), undoActionPart);
}


function Undo () {

    var undoStack = [];

    this.clear = function () {
        undoStack = [];
    };

    this.all = function () {
        var action;
        while ( undoStack.length > 0 ) {
            action = undoStack.pop();
            undoAction(action);
        }
    };

    this.once = function () {
        var action = undoStack.pop();
        if (action) { undoAction(action); }
        return action || [];
    };

    this.store = function (action) {
        if (!_.isEmpty(action)) {
            undoStack.push(action);
        }
    };
}

module.exports = Undo;

},{}],11:[function(require,module,exports){
var shuffle = require('./common/shuffle'),
    Game = require('./common/game'),
    Undo = require('./common/undo'),
    Drag = require('./common/drag'),
    Render = require('./common/render'),
    Bindings = require('./common/bindings');

var Setup = require('./solitaire/setup'),
    Checks = require('./solitaire/checks'),
    Actions = require('./solitaire/actions'),
    Board = require('./solitaire/board'),
    Input = require('./solitaire/input');


$(document).ready(function () {
    "use strict";

    var cards = Setup.createCards();
    var piles = Setup.createPiles();

    var checks = new Checks(piles);
    var actions = new Actions(piles, checks);
    var board = new Board(actions, checks);

    board.createCardElements(cards);
    board.createContainers(piles);

    function deal () {
        shuffle(cards);
        Setup.deal(cards, piles);
    }

    var render = new Render(board, checks);
    var undo = new Undo();
    var game = new Game(deal, render, undo);
    game.newGame();

    var drag = new Drag(render, game, board, checks);
    var input = new Input(game, actions);

    Bindings.bindDocumentEventHandlers(drag);
    Bindings.bindCardEventHandlers(input, drag);
    Bindings.bindMenuHandlers(game);

    $('#stock').click(function () {
        input.selectEmptyStock();
    });
});

},{"./common/bindings":2,"./common/drag":5,"./common/game":6,"./common/render":8,"./common/shuffle":9,"./common/undo":10,"./solitaire/actions":12,"./solitaire/board":13,"./solitaire/checks":14,"./solitaire/input":15,"./solitaire/setup":16}],12:[function(require,module,exports){
var _ = require('../../server/public/libs/underscore.js');

function Actions (piles, check) {

    function withCardAction (card) {
        return { card: card };
    }

    function takeCard (pile) {
        return pile.pop();
    }

    function addCard (pile, card) {
        card.container = pile;
        return pile.push(card);
    }

    function takeCardFrom (pile) {
        var card = takeCard(pile);
        return { card: card, origin: pile };
    }

    function addCardTo (pile, action) {
        addCard(pile, action.card);
        action.target = pile;
        return action;
    }

    function flipCardAction (action) {
        action.card.faceUp = !action.card.faceUp;
        action.flip = true;
        return action;
    }


    function isFoundation (pile) {
        return _.contains(piles.foundations, pile);
    }

    return {

        // TODO : remove self reference
        selectCard: function (card) {
            if (_.contains(piles.stock, card)) {
                return this.flipFromStockToWaste();
            } else if (!check.isShowing(card) && check.isTopCardInTableaux(card)) {
                var flip = _.compose(flipCardAction, withCardAction);
                return [ flip(card) ];
            } else {
                return [];
            }
        },

        flipFromStockToWaste: function () {
            var take = _.partial(takeCardFrom, piles.stock);
            var add = _.partial(addCardTo, piles.waste);
            var count = Math.min(3, piles.stock.length);
            var flipFromStockToWaste = _.compose(flipCardAction, add, take);

            return _.times(count, flipFromStockToWaste);
        },

        flipAllWasteToStock: function () {
            if (_.isEmpty(piles.stock)) {
                var take = _.partial(takeCardFrom, piles.waste);
                var add = _.partial(addCardTo, piles.stock);
                var flipFromWasteToStock = _.compose(flipCardAction, add, take);

                return _.map(piles.waste, flipFromWasteToStock);
            } else {
                return [];
            }
        },

        moveCardsToTableau: function (cards, tableau) {
            var card = _.first(cards);
            if (check.tableauAllowsCard(tableau, card)) {
                var pile = card.container;
                var temp = [];

                var take1 = _.partial(takeCardFrom, pile);
                var add1 = _.partial(addCardTo, temp);
                var moveToTemp = _.compose(add1, take1);

                var take2 = _.partial(takeCardFrom, temp);
                var add2 = _.partial(addCardTo, tableau);
                var moveToTableau = _.compose(add2, take2);

                var a = _.times(cards.length, moveToTemp);
                var b = _.times(cards.length, moveToTableau);
                return a.concat(b);

            } else {
                return [];
            }
        },

        moveCardToFoundation: function (card, foundation) {
            if (check.foundationAllowsCard(foundation, card)) {
                var pile = card.container;
                var take = _.partial(takeCardFrom, pile);
                var add = _.partial(addCardTo, foundation);
                var moveFromContainerToFoundation = _.compose(add, take);

                return [ moveFromContainerToFoundation() ];
            } else {
                return [];
            }
        },

        sendToFoundations: function (card) {
            var pile = card.container;
            if (!isFoundation(pile) && check.canTakeCardFrom(pile, card)) {
                var targetFoundation = _.find(piles.foundations, function (foundation) {
                    return check.foundationAllowsCard(foundation, card);
                });

                if (targetFoundation) {
                    var take = _.partial(takeCardFrom, pile);
                    var add = _.partial(addCardTo, targetFoundation);
                    var moveFromContainerToFoundation = _.compose(add, take);

                    return [ moveFromContainerToFoundation() ] ;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        }
    };
}

module.exports = Actions;

},{"../../server/public/libs/underscore.js":1}],13:[function(require,module,exports){
var Layout = require('../common/layout');

function Board (actions, check) {

    function doNothing () { return []; }
    function alwaysFalse () { return false; }

    function dropOnTableau (pile, cards) {
        return actions.moveCardsToTableau(cards, pile);
    }

    function dropOnFoundation (pile, cards) {
        if (cards.length === 1) {
            var dropCard = _.first(cards);
            return actions.moveCardToFoundation(dropCard, pile);
        } else {
            return [];
        }
    }

    function setupStockContainer (stock) {
        return {
            pile: stock,
            element: $('#stock'),
            layout: Layout.stacked,
            allowsCard: alwaysFalse,
            dropAction: doNothing
        };
    }

    function setupWasteContainer (waste) {
        return {
            pile: waste,
            element: $('#waste'),
            layout: Layout.stackedTopSpread,
            allowsCard: alwaysFalse,
            dropAction: doNothing
        };
    }

    function setupTableauContainers (tableaux) {
        return _.map(tableaux, function (tableau, index) {
            return {
                pile: tableau,
                element: $($('.tableau')[index]),
                layout: Layout.spreadDown,
                allowsCard: _.partial(check.tableauAllowsCard, tableau),
                dropAction: _.partial(dropOnTableau, tableau)
            };
        });
    }

    function setupFoundationContainers (foundations) {
        return _.map(foundations, function (foundation, index) {
            return {
                pile: foundation,
                element: $($('.foundation')[index]),
                layout: Layout.stacked,
                allowsCard: _.partial(check.foundationAllowsCard, foundation),
                dropAction: _.partial(dropOnFoundation, foundation)
            };
        });
    }

    var containers = [];

    this.allContainers = function () {
        return containers;
    };

    this.createCardElements = function (cards) {
        var tableDiv = $('#cards');
        return _.each(cards, function (card) {
            var element = document.createElement('div');
            $(element).addClass('card');
            tableDiv.append(element);
            card.element = element;
            element.card = card;
            return element;
        });
    };

    this.createContainers = function (solitaire) {
        var stockContainer = setupStockContainer(solitaire.stock);
        var wasteContainer = setupWasteContainer(solitaire.waste);
        var tableauContainers = setupTableauContainers(solitaire.tableaux);
        var foundationContainers = setupFoundationContainers(solitaire.foundations);

        containers.push(stockContainer);
        containers.push(wasteContainer);
        _.map(tableauContainers, function (x) { containers.push(x); });
        _.map(foundationContainers, function (x) { containers.push(x); });
    };

    this.removeAllElements = function (cards) {
        _.each(cards, function (card) {
            $(card.element).remove();
        });
    };

    this.containerForPile = function (pile) {
        return _.find(containers, function (container) {
            return container.pile === pile;
        });
    };
}

module.exports = Board;

},{"../common/layout":7}],14:[function(require,module,exports){
var _ = require('../../server/public/libs/underscore.js');
var CommonChecks = require('../common/checks');
var Deck = require('../common/deck');


function Checks (piles) {

    function isClickable (card) {
        return isFlippable(card) || isDraggable(card);
    }

    function isFlippable (card) {
        return !card.faceUp && (isTopCardInTableaux(card) || isTopCardInStock(card));
    }

    function isDraggable (card) {
        return CommonChecks.isShowing(card) && (
            isTopCardInWaste(card) ||
            CommonChecks.isWithin(piles.tableaux, card) ||
            isTopCardInFoundations(card) );
    }

    function isTopCardInStock (card) {
        return CommonChecks.isTopCardOf(piles.stock, card);
    }

    function isTopCardInWaste (card) {
        return CommonChecks.isTopCardOf(piles.waste, card);
    }

    function isTopCardInFoundations (card) {
        return _.some(piles.foundations, function (foundation) {
            return CommonChecks.isTopCardOf(foundation, card);
        });
    }

    function isTopCardInTableaux (card) {
        return _.some(piles.tableaux, function (tableau) {
            return CommonChecks.isTopCardOf(tableau, card);
        });
    }

    function tableauAllowsCard (tableau, card) {
        if (_.isEmpty(tableau)) {
            return card.rank === Deck.KING;
        } else {
            var topCard = _.last(tableau);
            return CommonChecks.isShowing(topCard) &&
                CommonChecks.isOneLessThan(card, topCard) &&
                CommonChecks.isDifferentColor(card, topCard);
        }
    }

    function foundationAllowsCard (foundation, card) {
        if (_.isEmpty(foundation)) {
            return card.rank === Deck.ACE;
        } else {
            var topCard = _.last(foundation);
            return CommonChecks.isSameSuit(card, topCard) &&
                CommonChecks.isOneMoreThan(card, topCard);
        }
    }

    function canTakeCardFrom (pile, card) {
        return CommonChecks.isShowing(card) &&
            CommonChecks.isTopCardOf(pile, card);
    }

    this.countOf = CommonChecks.countOf;
    this.isWithin = CommonChecks.isWithin;
    this.isTopCardOf = CommonChecks.isTopCardOf;
    this.isShowing = CommonChecks.isShowing;

    this.isClickable = isClickable;
    this.isDraggable = isDraggable;

    this.tableauAllowsCard = tableauAllowsCard;
    this.foundationAllowsCard = foundationAllowsCard;

    this.canTakeCardFrom = canTakeCardFrom;
    this.isTopCardInTableaux = isTopCardInTableaux;
}

module.exports = Checks;

},{"../../server/public/libs/underscore.js":1,"../common/checks":3,"../common/deck":4}],15:[function(require,module,exports){
function Input (game, actions) {
    "use strict";

    this.newGame = function () {
        return game.newGame();
    };

    this.restart = function () {
        return game.restart();
    };

    this.undoAction = function () {
        return game.undoAction();
    };

    this.singleClickCard = function (card) {
        var record = actions.selectCard(card);
        game.storeAction(record);
    };

    this.doubleClickCard = function (card) {
        var record = actions.sendToFoundations(card);
        game.storeAction(record);
    };

    this.selectEmptyStock = function () {
        var record = actions.flipAllWasteToStock();
        game.storeAction(record);
    };
}

module.exports = Input;

},{}],16:[function(require,module,exports){
var _ = require('../../server/public/libs/underscore.js');
var Deck = require('../common/deck');

function createEmptyArray () {
    return [];
}

var setupStock = createEmptyArray;
var setupWaste = createEmptyArray;

function setupTableaux () {
    return _.times(7, createEmptyArray);
}

function setupFoundations () {
    return _.times(4, createEmptyArray);
}

var sum = _.memoize(function (x) {
    return (x * (x + 1)) / 2;
});

function selectPosition (count, index) {
    var openSpaces = sum(count) - index;
    var row = 0;

    if (openSpaces > 0) {
        while (sum(row) < openSpaces) {
            row ++;
        }

        return index + sum(row - 1) - sum(count - 1);
    } else {
        return -1;
    }
}

function selectPile (piles, index) {
    if (index < 28) {
        var tabIndex = selectPosition(7, index);
        return piles.tableaux[tabIndex];
    } else {
        return piles.stock;
    }
}


module.exports = {

    createCards: function () {
        return Deck.createDeck(Deck.SUITS);
    },

    createPiles: function () {
        return {
            stock: setupStock(),
            waste: setupWaste(),
            tableaux: setupTableaux(),
            foundations: setupFoundations()
        };
    },

    deal: function (cards, piles) {
        var allPiles = [
            piles.stock,
            piles.waste,
            piles.tableaux[0],
            piles.tableaux[1],
            piles.tableaux[2],
            piles.tableaux[3],
            piles.tableaux[4],
            piles.tableaux[5],
            piles.tableaux[6],
            piles.foundations[0],
            piles.foundations[1],
            piles.foundations[2],
            piles.foundations[3]
        ];

        _.each(allPiles, function (pile) {
            while (pile.length > 0) {
                pile.pop();
            }
        });

        _.each(cards, function (card, index) {
            var pile = selectPile(piles, index);
            pile.push(card);
            card.faceUp = false;
            card.container = pile;
        });

        _.each(piles.tableaux, function (tableau) {
            var topCard = _.last(tableau);
            topCard.faceUp = true;
        });
    }
};

},{"../../server/public/libs/underscore.js":1,"../common/deck":4}]},{},[11]);
