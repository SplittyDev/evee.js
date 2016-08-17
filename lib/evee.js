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
    if (name.constructor !== String) {
      throw new TypeError('name has to be of type string.');
    }
    if (action.constructor !== Function) {
      throw new TypeError('action has to be of type function.');
    }
    let event = {
      name: name,
      action: action,
      id: this.gid++
    };
    for (let i = 0; i < this.receivers.length; i++) {
      let items = this.receivers[i];
      if (items.length > 0 && items[0].name === name) {
        items.push(event);
        return event;
      }
    }
    this.receivers.push([event]);
    return event;
  }

  /**
   * Subscribe to an event and fire only once.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  once (name, action) {
    if (name.constructor !== String) {
      throw new TypeError('name has to be of type string.');
    }
    if (action.constructor !== Function) {
      throw new TypeError('action has to be of type function.');
    }
    let event = {
      name: name,
      id: this.gid++,
      action: e => {
        this.drop(e.sender);
        return action(e);
      }
    };
    for (let i = 0; i < this.receivers.length; i++) {
      let items = this.receivers[i];
      if (items.length > 0 && items[0].name === name) {
        items.push(event);
        return event;
      }
    }
    this.receivers.push([event]);
    return event;
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
    for (let i = 0; i < this.receivers.length; i++) {
      let items = this.receivers[i];
      if (items.length > 0 && items[0].name === event.name) {
        items.splice(i, 1);
        return true;
      }
    }
    return false;
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
    if (this.receivers.length === 0) {
      return;
    }
    for (let i = 0; i < this.receivers.length; i++) {
      let items = this.receivers[i];
      if (items.length > 0 && items[0].name === target) {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          item.action({
            sender: item,
            data: data
          });
        }
        return;
      }
    }
    for (let i = 0; i < (target || []).length; i++) {
      let o = target[i];
      if (o.constructor === Object) {
        for (let i = 0; i < this.receivers.length; i++) {
          let items = this.receivers[i];
          if (items.length > 0 && items[0].name === o.name) {
            for (let i = 0; i < items.length; i++) {
              let item = items[i];
              item.action({
                sender: item,
                data: o.data
              });
            }
          }
        }
      } else if (o.constructor === String) {
        for (let i = 0; i < this.receivers.length; i++) {
          let items = this.receivers[i];
          if (items.length > 0 && items[0].name === o) {
            for (let i = 0; i < items.length; i++) {
              let item = items[i];
              item.action({
                sender: item,
                data: data
              });
            }
          }
        }
      } else {
        throw new TypeError('target has to be of type string|object|array.');
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
    if (this.receivers.length === 0) {
      return;
    }
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      for (let i = 0; i < this.receivers.length; i++) {
        let items = this.receivers[i];
        if (items.length > 0 && items[0].name === arg) {
          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.action({
              sender: item
            });
          }
        }
      }
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
