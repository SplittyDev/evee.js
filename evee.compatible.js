'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var evee = function evee() {

  // The event class
  var Eveent =

  /**
   * Construct a new Eveent object.
   * @param {object} name - The name of the event
   * @param {function} action - The event action
   * @param {number} id - The event identifier
   */
  function Eveent(name, action, id) {
    _classCallCheck(this, Eveent);

    this.name = name;
    this.action = action;
    this.id = id;
  };

  // The event data class


  var EveentData = function () {

    /**
     * Construct a new EveentData object.
     * @param {Eveent} sender - The event object
     * @param {object} data - The event data
     */
    function EveentData(sender, data) {
      _classCallCheck(this, EveentData);

      this.sender = sender;
      this.data = data;
    }

    /**
     * Test if the event contains any data.
     * @returns {bool} - Whether the event contains any data
     */


    _createClass(EveentData, [{
      key: 'hasData',
      value: function hasData() {
        return this.data !== undefined;
      }
    }]);

    return EveentData;
  }();

  // Prepare local globals


  var gid = 0,
      evee = {},
      receivers = [];

  /**
   * Subscribe to an event.
   * @param {object} name - The name of the event
   * @param {function} action - The event action
   * @returns {Eveent} - The event object
   */
  var subscribe = function subscribe(name, action) {
    if (typeof name !== 'string') {
      throw new TypeError('name has to be of type string.');
    }
    if (typeof action !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    var event = new Eveent(name, action, gid++);
    receivers.push(event);
    return event;
  };

  /**
   * Subscribe to an event.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  var on = function on(name, action) {
    return subscribe(name, action);
  };

  /**
   * Subscribe to an event and fire only once.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  var once = function once(name, action) {
    if (typeof action !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    return subscribe(name, function (e) {
      drop(e.sender);
      action(e);
    });
  };

  /**
   * Drop an event.
   * @param {Eveent} event - The event
   * @returns {boolean} - Whether the event has been dropped
   */
  var drop = function drop(event) {
    if (!(event instanceof Eveent)) {
      throw new TypeError('event has to be an instance of Eveent.');
    }
    var result = false;
    receivers.every(function (item, index, arr) {
      if (event === item) {
        arr.splice(index, 1);
        result = true;
      }
      return !result;
    });
    return result;
  };

  /**
   * Dispatch an event.
   * @param {string} name - The name of the event
   * @param {object=} data - The event data
   */
  var dispatch = function dispatch(name, data) {
    if (typeof name !== 'string') {
      throw new TypeError('name has to be of type string.');
    }
    receivers.filter(function (item) {
      return name === item.name;
    }).forEach(function (item) {
      return item.action(new EveentData(item, data));
    });
  };

  /**
   * Emit an event.
   * @param {string|array|object} target - The target(s)
   * @param {object=} data - The event data
   */
  var emit = function emit(target, data) {
    if (Array.isArray(target)) {
      target.forEach(function (item) {
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
          dispatch(item.name, item.data);
        } else {
          dispatch(item, data);
        }
      });
    } else {
      dispatch(target, data);
    }
  };

  /**
   * Emit an event n times.
   * @param {string} name - The event name
   * @param {number} n - The number of times the event should be dispatched
   * @param {function=} callback - The callback
   */
  var times = function times(name, n, callback) {
    if (typeof n !== 'number') {
      throw new TypeError('n has to be of type number.');
    }
    if (callback !== undefined && typeof callback !== 'function') {
      throw new TypeError('callback has to be of type function.');
    }
    var arr = Array(n);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = arr.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        emit(name, callback === undefined ? undefined : callback(i));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  /**
   * Signal an event.
   * @param {array} args - The names of the events
   */
  var signal = function signal() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 0) {
      throw new Error('signal called without arguments.');
    }
    args.forEach(function (item) {
      return dispatch(item);
    });
  };

  /**
   * Clear all receivers.
   */
  var clear = function clear() {
    return receivers.length = 0;
  };

  // Make functions available
  evee.on = on;
  evee.once = once;
  evee.emit = emit;
  evee.drop = drop;
  evee.times = times;
  evee.clear = clear;
  evee.signal = signal;

  // Return evee object
  return evee;
};

// The evee class

var Evee =

/**
 * Construct a new Evee object.
 */
function Evee() {
  _classCallCheck(this, Evee);

  return evee();
};

// Export the evee class


module.exports = Evee;
