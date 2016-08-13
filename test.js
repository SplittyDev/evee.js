var assert  = require('assert');
var Evee = require('./evee');
describe('evee', () => {
  describe('#on(name, action)', () => {
    it('should increment the id when subscribing', () => {
      var evee = new Evee();
      assert.equal(0, evee.on('a', _ => null).id);
      assert.equal(1, evee.on('b', _ => null).id);
      assert.equal(2, evee.on('c', _ => null).id);
    });
    it('should throw when the action is not a function', () => {
      var evee = new Evee();
      assert.throws(() => evee.on('a', null));
    });
  });
  describe('#unsubscribe(event)', () => {
    it('should return true when subscriptions were removed', () => {
      var evee = new Evee();
      var ev = evee.on('a', _ => null);
      assert.equal(true, evee.unsubscribe(ev));
    });
    it('should throw when the argument is not an event object', () => {
      var evee = new Evee();
      assert.throws(() => evee.unsubscribe(0));
    });
  });
  describe('#emit(name, data)', () => {
    it('should not dispatch when the event name matches no receivers', () => {
      var evee = new Evee();
      var res = false;
      evee.on('a', _ => res = true);
      evee.emit('b');
      assert.equal(false, res);
    });
    it('should dispatch when the event name matches a receiver', () => {
      var evee = new Evee();
      var res = false;
      evee.on('a', _ => res = true);
      evee.emit('a');
      assert.equal(true, res);
    });
    it('should dispatch when the event name matches multiple receivers', () => {
      var evee = new Evee();
      var res = 0;
      evee.on('a', _ => ++res);
      evee.on('a', _ => ++res);
      evee.emit('a');
      assert.equal(2, res);
    });
    it('should transmit the correct event data when dispatching', () => {
      var evee = new Evee();
      var res = 0;
      evee.on('a', e => res += e.data);
      evee.on('b', e => res += e.data);
      evee.emit('a', 11);
      evee.emit('b', 11);
      assert.equal(22, res);
    });
    it('should transmit the correct sender when dispatching', () => {
      var evee = new Evee();
      var res = false;
      var sender = evee.on('a', e => res = e.sender === sender);
      evee.emit('a');
      assert.equal(true, res);
    });
    it('should work exactly like dispatch', () => {
      var evee = new Evee();
      var res = false;
      evee.on('a', e => res = e.data);
      evee.emit('a', true);
      assert.equal(true, res);
    });
    it('should dispatch all events of an array', () => {
      var evee = new Evee();
      var resa = false;
      var resb = false;
      evee.on('a', e => resa = e.data);
      evee.on('b', e => resb = e.data);
      evee.emit(['a', 'b'], true);
      assert.equal(true, resa);
      assert.equal(true, resb);
    });
    it('should dispatch events with different data', () => {
      var evee = new Evee();
      var resa = false;
      var resb = true;
      evee.on('a', e => resa = e.data);
      evee.on('b', e => resb = e.data);
      evee.emit([{name: 'a', data: true}, {name: 'b', data: false}]);
      assert.equal(true, resa);
      assert.equal(false, resb);
    });
  });
  describe('#signal(...names)', () => {
    it('should correctly dispatch multiple events', () => {
      var evee = new Evee();
      var resa = false;
      var resb = false;
      evee.on('a', _ => resa = true);
      evee.on('b', _ => resb = true);
      evee.signal('a', 'b');
      assert.equal(true, resa);
      assert.equal(true, resb);
    });
  });
  describe('#once(name, action)', () => {
    it('should only dispatch once', () => {
      var evee = new Evee();
      var res = false;
      evee.once('a', _ => res = !res);
      evee.signal('a', 'a');
      assert.equal(true, res);
    });
  });
  describe('#clear()', () => {
    it('should clear the receiver list', () => {
      var evee = new Evee();
      var res = false;
      evee.on('a', _ => res = true);
      evee.clear();
      evee.signal('a');
      assert.equal(false, res);
    });
  });
});
