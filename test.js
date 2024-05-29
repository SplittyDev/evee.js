// Grab assert and the evee module
import assert from 'assert'
import Evee, { evee } from './dist/esm/index.js'

// Run tests with evee
run_tests(() => new Evee(), "evee (node, new instance)");
run_tests(() => {
  evee.clear();
  return evee
}, "evee (node, shared instance)");

function run_tests(makeInstance, name) {
  describe(name, () => {
    describe('#on(name, action)', () => {
      it('should dispatch properly', () => {
        const evee = makeInstance();
        var res = false;
        evee.on('a', _ => res = true);
        evee.signal('a');
        assert.equal(true, res);
      });
      it('should increment the id when subscribing', () => {
        const evee = makeInstance();
        assert.equal(0, evee.on('a', _ => undefined).id);
        assert.equal(1, evee.on('b', _ => undefined).id);
        assert.equal(2, evee.on('c', _ => undefined).id);
      });
      it('should throw when the name is not a string', () => {
        const evee = makeInstance();
        assert.throws(() => evee.on(undefined, () => undefined));
      });
      it('should throw when the action is not a function', () => {
        const evee = makeInstance();
        assert.throws(() => evee.on('a', undefined));
      });
      it('should throw when called without arguments', () => {
        const evee = makeInstance();
        assert.throws(() => evee.on());
      });
    });
    describe('#once(name, action)', () => {
      it('should only dispatch once', () => {
        const evee = makeInstance();
        var res = false;
        evee.once('a', _ => res = !res);
        evee.signal('a', 'a');
        assert.equal(true, res);
      });
      it('should increment the id when subscribing', () => {
        const evee = makeInstance();
        assert.equal(0, evee.once('a', _ => undefined).id);
        assert.equal(1, evee.once('b', _ => undefined).id);
        assert.equal(2, evee.once('c', _ => undefined).id);
      });
      it('should throw when the name is not a string', () => {
        const evee = makeInstance();
        assert.throws(() => evee.once(undefined, () => undefined));
      });
      it('should throw when the action is not a function', () => {
        const evee = makeInstance();
        assert.throws(() => evee.once('a', undefined));
      });
    });
    describe('#drop(event)', () => {
      it('should return true when subscriptions were removed', () => {
        const evee = makeInstance();
        var ev = evee.on('a', _ => undefined);
        assert.equal(true, evee.drop(ev));
      });
      it('should throw when the argument is not an event object', () => {
        const evee = makeInstance();
        assert.throws(() => evee.drop(0));
      });
      it('should throw when called without arguments', () => {
        const evee = makeInstance();
        assert.throws(() => evee.drop());
      });
      it('should remove the right event', () => {
        const evee = makeInstance();
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
        const evee = makeInstance();
        var res = 0;
        evee.on('a', e => res += e.data);
        evee.on('b', e => res += e.data);
        evee.emit('a', 11);
        evee.emit('b', 11);
        assert.equal(22, res);
      });
      it('should transmit the correct sender when dispatching', () => {
        const evee = makeInstance();
        var res = false;
        var sender = evee.on('a', e => res = e.sender === sender);
        evee.emit('a');
        assert.equal(true, res);
      });
      it('should not dispatch when the event name matches no receivers', () => {
        const evee = makeInstance();
        var res = false;
        evee.on('a', _ => res = true);
        evee.emit('b');
        assert.equal(false, res);
      });
      it('should dispatch when the event name matches a receiver', () => {
        const evee = makeInstance();
        var res = false;
        evee.on('a', _ => res = true);
        evee.emit('a');
        assert.equal(true, res);
      });
      it('should dispatch when the event name matches multiple receivers', () => {
        const evee = makeInstance();
        var res = 0;
        evee.on('a', _ => ++res);
        evee.on('a', _ => ++res);
        evee.emit('a');
        assert.equal(2, res);
      });
      it('should dispatch events with data', () => {
        const evee = makeInstance();
        var res = false;
        evee.on('a', e => res = e.data);
        evee.emit('a', true);
        assert.equal(true, res);
      });
      it('should dispatch events without data', () => {
        const evee = makeInstance();
        var res = false;
        evee.on('a', e => res = e.data === undefined ? true : false);
        evee.emit('a');
        assert.equal(true, res);
      });
      it('should dispatch multiple events with the same data', () => {
        const evee = makeInstance();
        var resa = false;
        var resb = false;
        evee.on('a', e => resa = e.data);
        evee.on('b', e => resb = e.data);
        evee.emit(['a', 'b'], true);
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should dispatch multiple events with no data', () => {
        const evee = makeInstance();
        var resa = true;
        var resb = false;
        evee.on('a', e => resa = e.data === undefined ? resa : !resa);
        evee.on('b', e => resb = e.data === undefined ? !resb : resb);
        evee.emit(['a', 'b']);
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should dispatch multiple events with different data', () => {
        const evee = makeInstance();
        var resa = false;
        var resb = true;
        evee.on('a', e => resa = e.data);
        evee.on('b', e => resb = e.data);
        evee.emit([{name: 'a', data: true}, {name: 'b', data: false}]);
        assert.equal(true, resa);
        assert.equal(false, resb);
      });
      it('should throw when called without arguments', () => {
        const evee = makeInstance();
        assert.throws(() => evee.emit());
      });
    });
    describe('#signal(...names)', () => {
      it('should correctly dispatch multiple events a single time', () => {
        const evee = makeInstance();
        var resa = false;
        var resb = false;
        evee.on('a', _ => resa = true);
        evee.on('b', _ => resb = true);
        evee.signal('a', 'b');
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should correctly dispatch the same event multiple multiple', () => {
        const evee = makeInstance();
        var res = false;
        evee.on('a', _ => res = !res);
        evee.signal('a', 'a', 'a');
        assert.equal(true, res);
      });
      it('should throw when called without arguments', () => {
        const evee = makeInstance();
        assert.throws(() => evee.signal());
      });
    });
    describe('#clear()', () => {
      it('should clear the receiver list', () => {
        const evee = makeInstance();
        var res = false;
        evee.on('a', _ => res = true);
        evee.clear();
        evee.signal('a');
        assert.equal(false, res);
      });
      it('should not throw when no subscriptions are active', () => {
        const evee = makeInstance();
        assert.doesNotThrow(() => evee.clear());
      });
    });
  });
}
