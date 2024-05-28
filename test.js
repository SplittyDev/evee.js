// Grab assert and the evee module
import assert from 'assert'
import Evee from './dist/esm/index.js'

// Run tests with ES6 evee
run_tests(Evee, "evee (node)");

function run_tests(Evee, name) {
  describe(name, () => {
    describe('#on(name, action)', () => {
      it('should dispatch properly', () => {
        var evee = new Evee();
        var res = false;
        evee.on('a', _ => res = true);
        evee.signal('a');
        assert.equal(true, res);
      });
      it('should increment the id when subscribing', () => {
        var evee = new Evee();
        assert.equal(0, evee.on('a', _ => undefined).id);
        assert.equal(1, evee.on('b', _ => undefined).id);
        assert.equal(2, evee.on('c', _ => undefined).id);
      });
      it('should throw when the name is not a string', () => {
        var evee = new Evee();
        assert.throws(() => evee.on(undefined, () => undefined));
      });
      it('should throw when the action is not a function', () => {
        var evee = new Evee();
        assert.throws(() => evee.on('a', undefined));
      });
      it('should throw when called without arguments', () => {
        var evee = new Evee();
        assert.throws(() => evee.on());
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
      it('should increment the id when subscribing', () => {
        var evee = new Evee();
        assert.equal(0, evee.once('a', _ => undefined).id);
        assert.equal(1, evee.once('b', _ => undefined).id);
        assert.equal(2, evee.once('c', _ => undefined).id);
      });
      it('should throw when the name is not a string', () => {
        var evee = new Evee();
        assert.throws(() => evee.once(undefined, () => undefined));
      });
      it('should throw when the action is not a function', () => {
        var evee = new Evee();
        assert.throws(() => evee.once('a', undefined));
      });
    });
    describe('#drop(event)', () => {
      it('should return true when subscriptions were removed', () => {
        var evee = new Evee();
        var ev = evee.on('a', _ => undefined);
        assert.equal(true, evee.drop(ev));
      });
      it('should throw when the argument is not an event object', () => {
        var evee = new Evee();
        assert.throws(() => evee.drop(0));
      });
      it('should throw when called without arguments', () => {
        var evee = new Evee();
        assert.throws(() => evee.drop());
      });
      it('should remove the right event', () => {
        var evee = new Evee();
        var resa = false;
        var resb = false;
        var eva = evee.on('a', _ => resa = true);
        var evb = evee.on('b', _ => resb = true);
        evee.drop(evb);
        evee.emit(['a', 'b']);
        assert.equal(true, resa);
        assert.equal(false, resb);
      });
    });
    describe('#emit(name, data)', () => {
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
      it('should dispatch events with data', () => {
        var evee = new Evee();
        var res = false;
        evee.on('a', e => res = e.data);
        evee.emit('a', true);
        assert.equal(true, res);
      });
      it('should dispatch events without data', () => {
        var evee = new Evee();
        var res = false;
        evee.on('a', e => res = e.data === undefined ? true : false);
        evee.emit('a');
        assert.equal(true, res);
      });
      it('should dispatch multiple events with the same data', () => {
        var evee = new Evee();
        var resa = false;
        var resb = false;
        evee.on('a', e => resa = e.data);
        evee.on('b', e => resb = e.data);
        evee.emit(['a', 'b'], true);
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should dispatch multiple events with no data', () => {
        var evee = new Evee();
        var resa = true;
        var resb = false;
        evee.on('a', e => resa = e.data === undefined ? resa : !resa);
        evee.on('b', e => resb = e.data === undefined ? !resb : resb);
        evee.emit(['a', 'b']);
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should dispatch multiple events with different data', () => {
        var evee = new Evee();
        var resa = false;
        var resb = true;
        evee.on('a', e => resa = e.data);
        evee.on('b', e => resb = e.data);
        evee.emit([{name: 'a', data: true}, {name: 'b', data: false}]);
        assert.equal(true, resa);
        assert.equal(false, resb);
      });
      it('should throw when called without arguments', () => {
        var evee = new Evee();
        assert.throws(() => evee.emit());
      });
    });
    describe('#signal(...names)', () => {
      it('should correctly dispatch multiple events a single time', () => {
        var evee = new Evee();
        var resa = false;
        var resb = false;
        evee.on('a', _ => resa = true);
        evee.on('b', _ => resb = true);
        evee.signal('a', 'b');
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should correctly dispatch the same event multiple multiple', () => {
        var evee = new Evee();
        var res = false;
        evee.on('a', _ => res = !res);
        evee.signal('a', 'a', 'a');
        assert.equal(true, res);
      });
      it('should throw when called without arguments', () => {
        var evee = new Evee();
        assert.throws(() => evee.signal());
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
      it('should not throw when no subscriptions are active', () => {
        var evee = new Evee();
        assert.doesNotThrow(() => evee.clear());
      });
    });
  });
}
