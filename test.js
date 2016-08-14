var assert  = require('assert'),
    EveeLib = require('./lib/evee.js'),
    EveeDist= require('./dist/evee.js');

run_tests(EveeLib, "evee-dev");
run_tests(EveeDist, "evee-dist");

function run_tests(Evee, name) {
  describe(name, () => {
    describe('#on(name, action)', () => {
      it('should dispatch properly', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', _ => res = true);
        evee.signal('a');
        assert.equal(true, res);
      });
      it('should increment the id when subscribing', () => {
        let evee = new Evee();
        assert.equal(0, evee.on('a', _ => undefined).id);
        assert.equal(1, evee.on('b', _ => undefined).id);
        assert.equal(2, evee.on('c', _ => undefined).id);
      });
      it('should throw when the name is not a string', () => {
        let evee = new Evee();
        assert.throws(() => evee.on(undefined, () => undefined));
      });
      it('should throw when the action is not a function', () => {
        let evee = new Evee();
        assert.throws(() => evee.on('a', undefined));
      });
      it('should throw when called without arguments', () => {
        let evee = new Evee();
        assert.throws(evee.on);
      });
    });
    describe('#once(name, action)', () => {
      it('should only dispatch once', () => {
        let evee = new Evee();
        let res = false;
        evee.once('a', _ => res = !res);
        evee.signal('a', 'a');
        assert.equal(true, res);
      });
      it('should increment the id when subscribing', () => {
        let evee = new Evee();
        assert.equal(0, evee.once('a', _ => undefined).id);
        assert.equal(1, evee.once('b', _ => undefined).id);
        assert.equal(2, evee.once('c', _ => undefined).id);
      });
      it('should throw when the name is not a string', () => {
        let evee = new Evee();
        assert.throws(() => evee.once(undefined, () => undefined));
      });
      it('should throw when the action is not a function', () => {
        let evee = new Evee();
        assert.throws(() => evee.once('a', undefined));
      });
    });
    describe('#drop(event)', () => {
      it('should return true when subscriptions were removed', () => {
        let evee = new Evee();
        let ev = evee.on('a', _ => undefined);
        assert.equal(true, evee.drop(ev));
      });
      it('should throw when the argument is not an event object', () => {
        let evee = new Evee();
        assert.throws(() => evee.drop(0));
      });
      it('should throw when called without arguments', () => {
        let evee = new Evee();
        assert.throws(evee.drop);
      });
    });
    describe('#emit(name, data)', () => {
      it('should transmit the correct event data when dispatching', () => {
        let evee = new Evee();
        let res = 0;
        evee.on('a', e => res += e.data);
        evee.on('b', e => res += e.data);
        evee.emit('a', 11);
        evee.emit('b', 11);
        assert.equal(22, res);
      });
      it('should transmit the correct sender when dispatching', () => {
        let evee = new Evee();
        let res = false;
        let sender = evee.on('a', e => res = e.sender === sender);
        evee.emit('a');
        assert.equal(true, res);
      });
      it('should not dispatch when the event name matches no receivers', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', _ => res = true);
        evee.emit('b');
        assert.equal(false, res);
      });
      it('should dispatch when the event name matches a receiver', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', _ => res = true);
        evee.emit('a');
        assert.equal(true, res);
      });
      it('should dispatch when the event name matches multiple receivers', () => {
        let evee = new Evee();
        let res = 0;
        evee.on('a', _ => ++res);
        evee.on('a', _ => ++res);
        evee.emit('a');
        assert.equal(2, res);
      });
      it('should dispatch events with data', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', e => res = e.data);
        evee.emit('a', true);
        assert.equal(true, res);
      });
      it('should dispatch events without data', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', e => res = e.data === undefined ? true : false);
        evee.emit('a');
        assert.equal(true, res);
      });
      it('should dispatch multiple events with the same data', () => {
        let evee = new Evee();
        let resa = false;
        let resb = false;
        evee.on('a', e => resa = e.data);
        evee.on('b', e => resb = e.data);
        evee.emit(['a', 'b'], true);
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should dispatch multiple events with no data', () => {
        let evee = new Evee();
        let resa = true;
        let resb = false;
        evee.on('a', e => resa = e.data === undefined ? resa : !resa);
        evee.on('b', e => resb = e.data === undefined ? !resb : resb);
        evee.emit(['a', 'b']);
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should dispatch multiple events with different data', () => {
        let evee = new Evee();
        let resa = false;
        let resb = true;
        evee.on('a', e => resa = e.data);
        evee.on('b', e => resb = e.data);
        evee.emit([{name: 'a', data: true}, {name: 'b', data: false}]);
        assert.equal(true, resa);
        assert.equal(false, resb);
      });
      it('should throw when called without arguments', () => {
        let evee = new Evee();
        assert.throws(evee.emit);
      });
    });
    describe('#signal(...names)', () => {
      it('should correctly dispatch multiple events a single time', () => {
        let evee = new Evee();
        let resa = false;
        let resb = false;
        evee.on('a', _ => resa = true);
        evee.on('b', _ => resb = true);
        evee.signal('a', 'b');
        assert.equal(true, resa);
        assert.equal(true, resb);
      });
      it('should correctly dispatch the same event multiple multiple', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', _ => res = !res);
        evee.signal('a', 'a', 'a');
        assert.equal(true, res);
      });
      it('should throw when called without arguments', () => {
        let evee = new Evee();
        assert.throws (evee.signal);
      });
    });
    describe('#times(name, n, callback)', () => {
      it('should do nothing if n has a value of 0', () => {
        let evee = new Evee();
        let res = 0;
        evee.on('a', e => res = e.data);
        evee.times('a', 0, i => i + 1);
        assert.equal(0, res);
      });
      it('should keep track of the index', () => {
        let evee = new Evee();
        let res = 0;
        evee.on('a', e => res = e.data);
        evee.times('a', 10, i => i + 1);
        assert.equal(10, res);
      });
      it('should accept parameterless callbacks', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', e => res = e.data);
        evee.times('a', 3, () => !res);
        assert.equal(true, res);
      });
      it('should work correctly without a callback', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', e => res = e.hasData() ? e.data : res);
        evee.times('a', 3);
        assert.equal(false, res);
      });
      it('should throw if n is not a number', () => {
        let evee = new Evee();
        assert.throws(() => evee.times('a', NaN, i => i));
      });
    });
    describe('#clear()', () => {
      it('should clear the receiver list', () => {
        let evee = new Evee();
        let res = false;
        evee.on('a', _ => res = true);
        evee.clear();
        evee.signal('a');
        assert.equal(false, res);
      });
      it('should not throw when no subscriptions are active', () => {
        let evee = new Evee();
        assert.doesNotThrow(evee.clear);
      });
    });
  });
}
