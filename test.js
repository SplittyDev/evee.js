var assert  = require('assert');
var evee = require('./evee');
describe('evee', () => {
  describe('#subscribe(name, action)', () => {
    it('should increment the id when subscribing', () => {
      ((evee) => {
        var evee = evee();
        assert.equal(0, evee.subscribe('a', _ => null).id);
        assert.equal(1, evee.subscribe('b', _ => null).id);
        assert.equal(2, evee.subscribe('c', _ => null).id);
      })(evee);
    });
    it('should throw when the action is not a function', () => {
      ((evee) => {
        var evee = evee();
        assert.throws(() => evee.subscribe('a', null));
      })(evee);
    });
  });
  describe('#unsubscribe(event)', () => {
    it('should return true when subscriptions were removed', () => {
      ((evee) => {
        var evee = evee();
        var ev = evee.subscribe('a', _ => null);
        assert.equal(true, evee.unsubscribe(ev));
      })(evee);
    });
    it('should throw when the argument is not an event object', () => {
      ((evee) => {
        var evee = evee();
        assert.throws(() => evee.unsubscribe(0));
      })(evee);
    });
  });
  describe('#dispatch(name, e)', () => {
    it('should dispatch when the event name matches a receiver', () => {
      ((evee) => {
        var evee = evee();
        var res = false;
        evee.subscribe('a', _ => res = true);
        evee.dispatch('a');
        assert.equal(true, res);
      })(evee);
    });
    it('should dispatch when the event name matches multiple receivers', () => {
      ((evee) => {
        var evee = evee();
        var res = 0;
        evee.subscribe('a', _ => ++res);
        evee.subscribe('a', _ => ++res);
        evee.dispatch('a');
        assert.equal(2, res);
      })(evee);
    });
    it('should not dispatch when the event name matches no receivers', () => {
      ((evee) => {
        var evee = evee();
        var res = false;
        evee.subscribe('a', _ => res = true);
        evee.dispatch('b');
        assert.equal(false, res);
      })(evee);
    });
  });
  describe('#clear()', () => {
    it('should clear the receiver list', () => {
      ((evee) => {
        var evee = evee();
        var res = false;
        evee.subscribe('a', _ => res = true);
        evee.clear();
        evee.dispatch('a');
        assert.equal(false, res);
      })(evee);
    });
  });
});
