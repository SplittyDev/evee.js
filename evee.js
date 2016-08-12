// evee.js - The lightweight es6 event library.
var evee = () => {
  // Prepare local globals
  var evee = {};
  var receivers = [];
  var gid = 0;
  /**
   * Verify the type of a parameter.
   * Throw if the type does not match the expected type.
   * @param {object} item - The argument itself
   * @param {string} name - The name of the argument
   * @param {string} expected - The expected type
   */
  var verifyType = (item, name, expected) => {
    if (typeof (item) !== expected) {
      throw "Argument '" + name + "' has to be of type '" + expected + "'.";
    }
  }
  /**
   * Subscribe to an event.
   * @param {string} name - The name of the event
   * @param {function} action - The event action
   * @returns {number} - The subscription identifier
   */
  var subscribe = (name, action) => {
    verifyType(name, 'name', 'string');
    verifyType(action, 'action', 'function');
    receivers.push({name: name, action: action, id: gid});
    return gid++;
  }
  /**
   * Unsubscribe from an event.
   * @param {number} id - The subscription identifier
   * @returns {boolean} - Whether the subscription has been removed
   */
  var unsubscribe = id => {
    verifyType(id, 'id', 'number');
    var result = false;
    receivers.every((item, index, arr) => {
      if (item['id'] === id) {
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
    verifyType(name, 'name', 'string');
    receivers
      .filter(item => name === item['name'])
      .forEach(item => item['action']({event: name, data: e}));
  };
  /**
   * List all receivers.
   * @returns {array} - The receivers
   */
  var list = () => receivers;
  /**
   * Clear all receivers.
   */
  var clear = () => {
    receivers.length = 0;
  };
  // Make functions accessible
  evee.subscribe = subscribe;
  evee.unsubscribe = unsubscribe;
  evee.dispatch = dispatch;
  evee.clear = clear;
  evee.list = list;
  // Return evee object
  return evee;
};
module.exports = evee;
