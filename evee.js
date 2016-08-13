// evee.js - The lightweight es6 event library.
let evee = () => {

  // The event class
  class Eveent {

    /**
     * Construct a new Eveent object.
     * @param {object} name - The name of the event
     * @param {function} action - The event action
     * @param {number} id - The event identifier
     */
    constructor(name, action, id) {
      this.name = name;
      this.action = action;
      this.id = id;
    }
  }

  // The event data class
  class EveentData {

    /**
     * Construct a new EveentData object.
     * @param {Eveent} sender - The event object
     * @param {object} data - The event data
     */
    constructor(sender, data) {
      this.sender = sender;
      this.data = data;
    }

    hasData() {
      return this.data !== undefined;
    }
  }

  // Prepare local globals
  let gid = 0,
      evee = {},
      receivers = [];

  /**
   * Subscribe to an event.
   * @param {object} name - The name of the event
   * @param {function} action - The event action
   * @returns {Eveent} - The event object
   */
  let subscribe = (name, action) => {
    if (typeof(name) !== 'string') {
      throw new TypeError('name has to be of type string.');
    }
    if (typeof(action) !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    let event = new Eveent(name, action, gid++);
    receivers.push(event);
    return event;
  }

  /**
   * Subscribe to an event.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  let on = (name, action) => subscribe(name, action);

  /**
   * Subscribe to an event and fire only once.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  let once = (name, action) => {
    if (typeof(action) !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    return subscribe(name, e => {
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
    if (!(event instanceof Eveent)) {
      throw new TypeError('event has to be an instance of Eveent.');
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
   * Dispatch an event.
   * @param {string} name - The name of the event
   * @param {object=} data - The event data
   */
  let dispatch = (name, data) => {
    if (typeof(name) !== 'string') {
      throw new TypeError('name has to be of type string.');
    }
    receivers
      .filter(item => name === item.name)
      .forEach(item => item.action(new EveentData(item, data)));
  };

  /**
   * Emit an event.
   * @param {string|array|object} target - The target(s)
   * @param {object=} data - The event data
   */
  let emit = (target, data) => {
    if (Array.isArray(target)) {
      target.forEach(item => {
        if (typeof(item) === 'object') {
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
  let times = (name, n, callback) => {
    if (typeof(n) !== 'number') {
      throw new TypeError('n has to be of type number.');
    }
    if (typeof(callback) !== 'function') {
      throw new TypeError('callback has to be of type function.');
    }
    let arr = Array(n);
    for (let i of arr.keys()) {
      emit(name, callback(i));
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
    args.forEach(item => dispatch(item));
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
