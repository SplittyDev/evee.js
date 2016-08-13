// evee.js - The lightweight es6 event library.
var evee = () => {

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
  }

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
   * Subscribe to an event.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  var on = (name, action) => {
    subscribe(name, action);
  };

  /**
   * Subscribe to an event and fire only once.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  var once = (name, action) => {
    subscribe(name, e => {
      unsubscribe(e.sender);
      action(e);
    });
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

  // Core functionality
  evee.subscribe = subscribe;
  evee.unsubscribe = unsubscribe;
  evee.dispatch = dispatch;
  evee.clear = clear;

  // Additional functionality
  evee.on = on;
  evee.once = once;

  // Return evee object
  return evee;
};

// The evee class
class Evee {

  /**
   * Construct a new Evee object.
   */
  constructor(extensions) {
    ((evee) => {
      var evee = evee();

      // Core functionality
      this.subscribe = evee.subscribe;
      this.unsubscribe = evee.unsubscribe;
      this.dispatch = evee.dispatch;
      this.clear = evee.clear;

      // Additional functionality
      this.on = evee.on;
      this.once = evee.once;
    })(evee);
  }
}

// Export the evee class
module.exports = Evee;
