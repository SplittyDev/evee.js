var assert  = require('assert');
var evee = require('./evee');
describe('evee', () => {
  describe('#subscribe(name, action)', () => {
    it('should increment the id when subscribing', () => {
      ((evee) => {
        var evee = evee();
        assert.equal(0, evee.subscribe('a', e => null));
        assert.equal(1, evee.subscribe('b', e => null));
        assert.equal(2, evee.subscribe('c', e => null));
      })(evee);
    });
    it('should throw when the event name is not a string', () => {
      ((evee) => {
        var evee = evee();
        assert.throws(() => evee.subscribe(0xFF, e => null));
      })(evee);
    });
    it('should throw when the action is not a function', () => {
      ((evee) => {
        var evee = evee();
        assert.throws(() => evee.subscribe('a', null));
      })(evee);
    });
  });
  describe('#unsubscribe(id)', () => {
    it('should return false when no subscriptions were removed', () => {
      ((evee) => {
        var evee = evee();
        assert.equal(false, evee.unsubscribe(0));
      })(evee);
    });
    it('should return true when subscriptions were removed', () => {
      ((evee) => {
        var evee = evee();
        var tid = evee.subscribe('a', e => null);
        assert.equal(true, evee.unsubscribe(tid));
      })(evee);
    });
    it('should throw when the id is not a number', () => {
      ((evee) => {
        var evee = evee();
        assert.throws(() => evee.unsubscribe(undefined));
      })(evee);
    });
  });
  describe('#dispatch(name, e)', () => {
    it('should dispatch when the event name matches a receiver', () => {
      ((evee) => {
        var evee = evee();
        var res = false;
        evee.subscribe('a', e => res = true);
        evee.dispatch('a');
        assert.equal(true, res);
      })(evee);
    });
    it('should dispatch when the event name matches multiple receivers', () => {
      ((evee) => {
        var evee = evee();
        var res = 0;
        evee.subscribe('a', e => ++res);
        evee.subscribe('a', e => ++res);
        evee.dispatch('a');
        assert.equal(2, res);
      })(evee);
    });
    it('should not dispatch when the event name matches no receivers', () => {
      ((evee) => {
        var evee = evee();
        var res = false;
        evee.subscribe('a', e => res = true);
        evee.dispatch('b');
        assert.equal(false, res);
      })(evee);
    });
    it('should throw when the event name is not a string', () => {
      ((evee) => {
        var evee = evee();
        assert.throws(() => evee.dispatch(undefined));
      })(evee);
    });
  });
  describe('#list()', () => {
    it('should return an empty array when there are no receivers', () => {
      ((evee) => {
        var evee = evee();
        assert.equal(0, evee.list().length);
      })(evee);
    });
    it('should return the number of receivers', () => {
      ((evee) => {
        var evee = evee();
        evee.subscribe('a', e => null);
        evee.subscribe('b', e => null);
        assert.equal(2, evee.list().length)
      })(evee);
    });
  });
  describe('#clear()', () => {
    it('should clear the receiver list', () => {
      ((evee) => {
        var evee = evee();
        evee.subscribe('a', e => null);
        evee.clear();
        assert.equal(0, evee.list().length);
      })(evee);
    });
  });
});
