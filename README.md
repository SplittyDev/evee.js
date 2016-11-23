[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?maxAge=10&style=flat-square)](https://raw.githubusercontent.com/SplittyDev/evee.js/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/evee.svg?maxAge=10&style=flat-square)](https://www.npmjs.com/package/evee)
[![Travis](https://img.shields.io/travis/SplittyDev/evee.js.svg?maxAge=10&style=flat-square)](https://travis-ci.org/SplittyDev/evee.js)

# evee.js
The blazing fast ES6 event library.

Evee is a lightweight event library, written in clean ECMAScript6.   
Evee exports both an ES5 and an ES6 version to support a wide range of clients.

## Status
The project is still actively maintained, but the functionality is complete.   
Bugs will still be fixed and feature requests are more than welcome.

## How to upgrade from evee 1.x to evee 2.1.0+
From version 2.1.0, evee exports two entry points: `evee` and `evee/es6`.   
The `evee` export is what you're used to, and will work with all ES5 compatible targets.   
The `evee/es6` export is the ES6 version of evee, which is generally faster.

If you wanna keep using the ES5 version, you don't need to change anything!   
If you wanna upgrade to the beautiful ES6 version, here's how to do it:

```js
// Importing evee/es6 (require)
const Evee = require('evee/es6'),
      evee = new Evee;

// Importing evee/es6 (ES6 modules)
import Evee from 'evee/es6';
const  evee = new Evee;
```

## How to use
```js
// Grab a new evee instance
const Evee = require('evee/es6'),
      evee = new Evee;

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
const Evee = require('evee/es6'),
      evee = new Evee;

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
const Evee = require('evee/es6'),
      evee = new Evee;

// Subscribe to the 'say' event
evee.once('say', e => console.log('hello, world'));

// Dispatch the 'say' event two times
evee.signal('say');
evee.signal('say');

// hello, world is only printed once!
```

As you can see, evee is really easy to use!   
Start using evee today and stop worrying about slow events :)

## Running the benchmarks
```
$ git clone git@github.com:SplittyDev/evee.js.git
$ cd evee.js
$ npm install --only=dev
$ npm run-script bench-dev
```
