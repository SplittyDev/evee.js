export default class Evee {

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
    const event = {
      name,
      action,
      id: this.gid++
    };
    for (let i = 0; i < this.receivers.length; i++) {
      const items = this.receivers[i];
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
    const event = {
      name,
      id: this.gid++,
      action: e => {
        this.drop(e.sender);
        return action(e);
      }
    };
    for (let i = 0; i < this.receivers.length; i++) {
      const items = this.receivers[i];
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
      const items = this.receivers[i];
      if (items.length === 0 || items[0].name !== event.name) {
        continue;
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === event.id) {
          items.splice(i, 1);
          return true;
        }
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
    for (let i = 0; i < (target || []).length; i++) {
      const o = target[i];
      if (o.constructor === Object) {
        for (let i = 0; i < this.receivers.length; i++) {
          const items = this.receivers[i];
          if (items.length > 0 && items[0].name === target) {
            for (let i = 0; i < items.length; i++) {
              const sender = items[i];
              sender.action({ sender, data });
            }
            return;
          }
          if (items.length > 0 && items[0].name === o.name) {
            for (let i = 0; i < items.length; i++) {
              const sender = items[i];
              sender.action({ sender, data: o.data });
            }
          }
        }
      } else if (o.constructor === String) {
        for (let i = 0; i < this.receivers.length; i++) {
          const items = this.receivers[i];
          if (items.length > 0 && items[0].name === target) {
            for (let i = 0; i < items.length; i++) {
              const sender = items[i];
              sender.action({ sender, data });
            }
            return;
          }
          if (items.length > 0 && items[0].name === o) {
            for (let i = 0; i < items.length; i++) {
              const sender = items[i];
              sender.action({ sender, data });
            }
          }
        }
      } else {
        throw new TypeError('target has to be of type string|object|array.');
      }
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
      const arg = args[i];
      for (let i = 0; i < this.receivers.length; i++) {
        const items = this.receivers[i];
        if (items.length > 0 && items[0].name === arg) {
          for (let i = 0; i < items.length; i++) {
            const sender = items[i];
            sender.action({ sender });
          }
        }
      }
    }
  }

  /**
   * Clear all receivers.
   */
  clear () {
    this.gid = 0;
    this.receivers = [];
  }
}

export const evee = new Evee();
