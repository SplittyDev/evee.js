'use strict';
let evee = () => {

  // Prepare local globals
  let gid = 0,
      evee = {},
      receivers = [];

  /**
   * Subscribe to an event.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  let on = (name, action) => {
    if (typeof(name) !== 'string') {
      throw new TypeError('name has to be of type string.');
    }
    if (typeof(action) !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    let event = {
      name: name,
      action: action,
      id: gid++
    };
    receivers.push(event);
    return event;
  };

  /**
   * Subscribe to an event and fire only once.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  let once = (name, action) => {
    if (typeof(action) !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    return on(name, e => {
      drop(e.sender);
      action(e);
    });
  }

  /**
   * Drop an event.
   * @param {Eveent} event - The event
   * @returns {boolean} - Whether the event has been dropped
   */
  let drop = event => {
    if (event === undefined || event.name === undefined) {
      throw new TypeError('attempt to drop undefined event.');
    }
    let result = false;
    receivers.every((item, index, arr) => {
      if (event === item) {
        arr.splice(index, 1);
        result = true;
      }
      return !result;
    });
    return result;
  }

  /**
   * Emit an event.
   * @param {string|array|object} target - The target(s)
   * @param {object=} data - The event data
   */
  let emit = (target, data) => {
    if (target === undefined && data === undefined) {
      throw new Error('emit called without arguments.');
    }
    if (!Array.isArray(target)) {
      receivers.forEach(item => {
        if (item.name === target) {
          item.action({
            sender: item,
            data: data,
            hasData: () => data !== undefined
          });
        }
      });
      return;
    }
    for (let i = 0; i < target.length; i++) {
      let o = target[i];
      let revlen = receivers.length;
      if (typeof(o) === 'object') {
        for (let i = 0; i < revlen; i++) {
          let item = receivers[i];
          if (item.name === o.name) {
            item.action({
              sender: item,
              data: o.data,
              hasData: () => o.data !== undefined
            });
          }
        }
      } else {
        receivers.forEach(item => {
          if (item.name !== o) {
            item.action({
              sender: item,
              data: data,
              hasData: () => data !== undefined
            });
          }
        });
      }
    }
  };

  /**
   * Emit an event n times.
   * @param {string} name - The event name
   * @param {number} n - The number of times the event should be dispatched
   * @param {function=} callback - The callback
   */
  let times = (name, n, callback) => {
    if (typeof(n) !== 'number') {
      throw new TypeError('n has to be of type number.');
    }
    if (callback !== undefined && typeof(callback) !== 'function') {
      throw new TypeError('callback has to be of type function.');
    }
    let arr = Array(n);
    for (let i of arr.keys()) {
      emit(name, callback === undefined ? undefined : callback(i));
    }
  }

  /**
   * Signal an event.
   * @param {array} args - The names of the events
   */
  let signal = (...args) => {
    if (args.length === 0) {
      throw new Error('signal called without arguments.');
    }
    for (let i = 0; i < args.length; i++) {
      emit(args[i]);
    }
  };

  /**
   * Clear all receivers.
   */
  let clear = () => receivers.length = 0;

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
class Evee {

  /**
   * Construct a new Evee object.
   */
  constructor () {
    return evee();
  }
}

// Export the evee class
module.exports = Evee;
