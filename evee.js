// evee.js - The lightweight es6 event library.
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
}
var evee = () => {
  // Prepare local globals
  var evee = {};
  var receivers = [];
  var gid = 0;
  /**
   * Subscribe to an event.
   * @param {object} name - The name of the event
   * @param {function} action - The event action
   * @returns {Eveent} - The event object
   */
  var subscribe = (name, action) => {
    if (typeof (action) !== 'function') {
      throw new TypeError('action has to be of type function.');
    }
    var ev = new Eveent(name, action, gid++);
    receivers.push(ev);
    return ev;
  }
  /**
   * Unsubscribe from an event.
   * @param {Eveent} event - The event
   * @returns {boolean} - Whether the subscription has been removed
   */
  var unsubscribe = event => {
    if (!(event instanceof Eveent)) {
      throw new TypeError("event has to be an instance of Eveent.");
    }
    var result = false;
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
   * @param {object} e - The event data
   */
  var dispatch = (name, e) => {
    receivers
      .filter(item => name === item.name)
      .forEach(item => item.action(new EveentData(item, e)));
  };
  /**
   * Clear all receivers.
   */
  var clear = () => receivers.length = 0;
  // Make functions accessible
  evee.subscribe = subscribe;
  evee.unsubscribe = unsubscribe;
  evee.dispatch = dispatch;
  evee.clear = clear;
  // Return evee object
  return evee;
};
module.exports = evee;
