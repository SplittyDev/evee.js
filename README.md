[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?maxAge=10&style=flat-square)](https://raw.githubusercontent.com/SplittyDev/evee.js/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/evee.svg?maxAge=10&style=flat-square)](https://www.npmjs.com/package/evee)
[![Travis](https://img.shields.io/travis/SplittyDev/evee.js.svg?maxAge=10&style=flat-square)](https://travis-ci.org/SplittyDev/evee.js)

# evee.js
The blazing fast es6 event library.

Evee is a lightweight event library, written in clean ECMAScript6.   

## Status
The project is still actively maintained, but the functionality is complete.   
Bugs will still be fixed and feature requests are more than welcome.

## How to use
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'update' event
evee.on('update', e => console.log(`Ticks: ${e.data}`));

var ticks = 0;
while(true) {

  // Dispatch the 'update' event
  evee.emit('update', ++ticks);
}
```

You can also keep track of your event listeners unsubscribe from events you don't need anymore.
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'say' event
var receiver = evee.on('say', e => console.log(e.data));

// Dispatch the 'say' event
evee.emit('say', 'Hello, world!');

// Unsubscribe from the 'say' event
evee.drop(receiver);
```

If you want to fire an event only once, you can do that too!   
The event will be automatically removed after the first usage:
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'say' event
evee.once('say', e => console.log('hello, world'));

// Dispatch the 'say' event two times
evee.signal('say');
evee.signal('say');

// hello, world is only printed once!
```

As you can see, evee is really easy to use!   
Start using evee today and fire events at nearly the speed of light<sup>1</sup> :)

<sup>1</sup> <sub>That's probably not true, but who knows.</sub>

## Performance
Production version, EventEmitter vs evee.js, benchmarked using `benchmark`:
```js
// Instantiation is way faster using the ES6 version in 'lib/evee.js'.
// However, this is the production-ready ES5-compiled version of evee.js.
node new x 20,266,853 ops/sec ±2.62% (73 runs sampled)
evee new x 23,012,807 ops/sec ±1.97% (74 runs sampled)

// Adding a handler using EventEmitter is just a tiny bit faster.
// This does not really matter though, since most events are only added once.
node on x 1,712,034 ops/sec ±19.14% (15 runs sampled)
evee on x 1,406,768 ops/sec ±24.46% (33 runs sampled)

// Emitting events is extremely fast when using evee.js.
// The library will be spending most of its time emitting events, so this is good.
node emit x 4,554,873 ops/sec ±47.39% (62 runs sampled)
evee emit x 26,046,727 ops/sec ±2.12% (75 runs sampled)

// Clearing events is pretty fast too
node clear x 14,804,976 ops/sec ±7.71% (72 runs sampled)
evee clear x 22,414,561 ops/sec ±6.55% (72 runs sampled)
```

The results may be different on your machine, so I suggest running the benchmarks yourself:
```
$ git clone git@github.com:SplittyDev/evee.js.git
$ cd evee.js
$ npm install --only=dev
$ npm run-script bench-dev
```
