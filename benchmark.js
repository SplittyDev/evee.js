var Benchmark     = require ('benchmark'),
    EventEmitter  = require ('events'),
    Evee          = require ('./lib/evee.js'),
    suite         = new Benchmark.Suite;

suite.add('node#emit', () => {
  let emitter = new EventEmitter;
  emitter.on('event', () => undefined);
  emitter.emit('event');
}).add('evee#emit', () => {
  let evee = new Evee;
  evee.on('event', () => undefined);
  evee.emit('event');
}).on('cycle', event => {
  console.log(String(event.target));
}).run({ 'async': true });
