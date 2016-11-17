[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?maxAge=10&style=flat-square)](https://raw.githubusercontent.com/SplittyDev/evee.js/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/evee.svg?maxAge=10&style=flat-square)](https://www.npmjs.com/package/evee)
[![Travis](https://img.shields.io/travis/SplittyDev/evee.js.svg?maxAge=10&style=flat-square)](https://travis-ci.org/SplittyDev/evee.js)

# evee.js
The blazing fast ES6 event library.

Evee is a lightweight event library, written in clean ECMAScript6.   
Evee exports both an ES5 and an ES6 version to support a wide range of clients.

## How to upgrade from evee 1.x to evee 2.0
From version 2.0.0, evee exposes two constructors: `Evee` and `Evee6`.   
The `Evee` export is what you're used to, and will work with all ES5 compatible targets.   
The `Evee6` export is the ES6 version of evee, which is substantially faster.

Currently you are probably using evee like this:
```js
// Require syntax
const Evee = require('evee'),
      evee = new Evee;

// Import syntax
import Evee from 'evee';
const evee = new Evee;
```

Because of the new ES6 export, this is now slightly different.   
For ES5 targets (use this if you want to support as much configurations as possible):
```js
// Require syntax
const Evee = require('evee').Evee,
      evee = new Evee;

// Import syntax
import {Evee} from 'evee';
const evee = new Evee;
```

For ES6 targets (only use this if you are sure all your clients support ES6):
```js
// Require syntax
const Evee = require('evee').Evee6;
      evee = new Evee;

// Import syntax
import {Evee6} from 'evee';
const evee = new Evee6;

// Alternative import syntax
import {Evee6 as Evee} from 'evee';
const evee = new Evee;
```

## Status
The project is still actively maintained, but the functionality is complete.   
Bugs will still be fixed and feature requests are more than welcome.

## How to use
```js
// Grab a new evee instance
const Evee = require('evee'),
      evee = new Evee.Evee();

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
const Evee = require('evee'),
      evee = new Evee.Evee();

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
const Evee = require('evee'),
      evee = new Evee.Evee();

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

## Running the benchmarks
```
$ git clone git@github.com:SplittyDev/evee.js.git
$ cd evee.js
$ npm install --only=dev
$ npm run-script bench-dev
```
