'use strict';
class Evee {

  /**
   * Construct a new Evee object.
   */
  constructor () {
    this.gid = 0;
    this.receivers = [];
  }

  /**
   * Subscribe to an event.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  on (name, action) {
    if (typeof(name) !== 'string') {
      throw new TypeError('name has to be of type string.');
    }
    if (typeof(action) !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    let event = {
      name: name,
      action: action,
      id: this.gid++
    };
    this.receivers.push(event);
    return event;
  }

  /**
   * Subscribe to an event and fire only once.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  once (name, action) {
    if (typeof(action) !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    return this.on(name, e => {
      this.drop(e.sender);
      action(e);
    });
  }

  /**
   * Drop an event.
   * @param {Object} event - The event
   * @returns {boolean} - Whether the event has been dropped
   */
  drop (event) {
    if (event === undefined || event.name === undefined) {
      throw new TypeError('attempt to drop undefined event.');
    }
    let result = false;
    this.receivers.every((item, index, arr) => {
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
  emit (target, data) {
    if (target === undefined && data === undefined) {
      throw new Error('emit called without arguments.');
    }
    if (!Array.isArray(target)) {
      for (let i = 0; i < this.receivers.length; i++) {
        let item = this.receivers[i];
        if (item.name !== target) continue;
        item.action({
          sender: item,
          data: data,
          hasData: () => data !== undefined
        });
      }
    } else {
      for (let i = 0; i < target.length; i++) {
        let o = target[i];
        if (typeof(o) === 'object') {
          for (let i = 0; i < this.receivers.length; i++) {
            let item = this.receivers[i];
            if (item.name === o.name) {
              item.action({
                sender: item,
                data: o.data,
                hasData: () => o.data !== undefined
              });
            }
          }
        } else {
          for (let i = 0; i < this.receivers.length; i++) {
            let item = this.receivers[i];
            if (item.name !== o) {
              item.action({
                sender: item,
                data: data,
                hasData: () => data !== undefined
              });
            }
          }
        }
      }
    }
  }

  /**
   * Emit an event n times.
   * @param {string} name - The event name
   * @param {number} n - The number of times the event should be dispatched
   * @param {function=} callback - The callback
   */
  times (name, n, callback) {
    if (typeof(n) !== 'number') {
      throw new TypeError('n has to be of type number.');
    }
    if (callback !== undefined && typeof(callback) !== 'function') {
      throw new TypeError('callback has to be of type function.');
    }
    let arr = Array(n);
    for (let i of arr.keys()) {
      this.emit(name, callback === undefined ? undefined : callback(i));
    }
  }

  /**
   * Signal an event.
   * @param {array} args - The names of the events
   */
  signal (...args) {
    if (args.length === 0) {
      throw new Error('signal called without arguments.');
    }
    for (let i = 0; i < args.length; i++) {
      this.emit(args[i]);
    }
  }

  /**
   * Clear all receivers.
   */
  clear () {
    this.receivers = [];
  }
}

// Export the evee class
module.exports = Evee;
