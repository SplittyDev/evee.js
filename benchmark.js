// Grab Benchmark
var Benchmark = require ('benchmark');

// Grab Node, Evee5 and Evee6
const Node  = require ('events'),
      Evee  = require ('./index.js').Evee,
      Evex  = require ('./index.js').Evee6,
      suite = new Benchmark.Suite;

// Initialise globals
var node = new Node;
var evee = new Evee;
var evex = new Evex;

suite.add('node  new', () => {
  var _ = new Node;
}).add('evee5 new', () => {
  var _ = new Evee;
}).add('evee6 new', () => {
  var _ = new Evex;
}).add('node  clear', () => {
  node.removeAllListeners();
}).add('evee5 clear', () => {
  evee.clear();
}).add('evee6 clear', () => {
  evex.clear();
}).add('node  on', () => {
  node.on('event', () => undefined);
}).add('evee5 on', () => {
  evee.on('event', () => undefined);
}).add('evee6 on', () => {
  evex.on('event', () => undefined);
}).add('node  emit', () => {
  node.emit('event');
}).add('evee5 emit', () => {
  evee.emit('event');
}).add('evee6 emit', () => {
  evex.emit('event');
}).on('cycle', event => {
  node = new Node;
  node.setMaxListeners(99999999);
  evee = new Evee;
  evex = new Evex;
  console.log(String(event.target));
}).run({ 'async': false });
