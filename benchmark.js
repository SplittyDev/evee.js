var Benchmark = require ('benchmark'),
    Node      = require ('events'),
    Evee      = require ('./index.js'),
    suite     = new Benchmark.Suite;

var node = new Node;
var evee = new Evee;

suite.add('node new', () => {
  let node = new Node;
}).add('evee new', () => {
  let evee = new Evee;
}).add('node clear', () => {
  node.removeAllListeners();
}).add('evee clear', () => {
  evee.clear();
}).add('node on', () => {
  node.on('event', () => undefined);
}).add('evee on', () => {
  evee.on('event', () => undefined);
}).add('node emit', () => {
  node.emit('event');
}).add('evee emit', () => {
  evee.emit('event');
}).on('cycle', event => {
  node.removeAllListeners();
  evee.clear();
  node = new Node;
  node.setMaxListeners(99999999);
  evee = new Evee;
  console.log(String(event.target));
}).run({ 'async': true });
