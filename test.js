var assert  = require('assert');
var Evee = require('./evee');
describe('evee', () => {
  describe('#subscribe(name, action)', () => {
    it('should increment the id when subscribing', () => {
      var evee = new Evee();
      assert.equal(0, evee.subscribe('a', _ => null).id);
      assert.equal(1, evee.subscribe('b', _ => null).id);
      assert.equal(2, evee.subscribe('c', _ => null).id);
    });
    it('should throw when the action is not a function', () => {
      var evee = new Evee();
      assert.throws(() => evee.subscribe('a', null));
    });
  });
  describe('#unsubscribe(event)', () => {
    it('should return true when subscriptions were removed', () => {
      var evee = new Evee();
      var ev = evee.subscribe('a', _ => null);
      assert.equal(true, evee.unsubscribe(ev));
    });
    it('should throw when the argument is not an event object', () => {
      var evee = new Evee();
      assert.throws(() => evee.unsubscribe(0));
    });
  });
  describe('#dispatch(name, e)', () => {
    it('should dispatch when the event name matches a receiver', () => {
      var evee = new Evee();
      var res = false;
      evee.subscribe('a', _ => res = true);
      evee.dispatch('a');
      assert.equal(true, res);
    });
    it('should dispatch when the event name matches multiple receivers', () => {
      var evee = new Evee();
      var res = 0;
      evee.subscribe('a', _ => ++res);
      evee.subscribe('a', _ => ++res);
      evee.dispatch('a');
      assert.equal(2, res);
    });
    it('should not dispatch when the event name matches no receivers', () => {
      var evee = new Evee();
      var res = false;
      evee.subscribe('a', _ => res = true);
      evee.dispatch('b');
      assert.equal(false, res);
    });
  });
  describe('#clear()', () => {
    it('should clear the receiver list', () => {
      var evee = new Evee();
      var res = false;
      evee.subscribe('a', _ => res = true);
      evee.clear();
      evee.dispatch('a');
      assert.equal(false, res);
    });
  });
});
