import Benchmark from 'benchmark'
import { default as Node } from 'events'
import Evee from './dist/esm/index.js'

const suite = new Benchmark.Suite()

// Initialise globals
var node = new Node();
var evee = new Evee();

node.setMaxListeners(99999999);

suite.add('node new', () => {
  var _ = new Node();
}).add('evee new', () => {
  var _ = new Evee();
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
  console.log(String(event.target));
}).run({ 'async': true });
