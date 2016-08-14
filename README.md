[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?maxAge=0&style=flat-square)](https://raw.githubusercontent.com/SplittyDev/evee.js/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/evee.svg?maxAge=0&style=flat-square)](https://www.npmjs.com/package/evee)
[![Travis](https://img.shields.io/travis/SplittyDev/evee.js.svg?maxAge=0&style=flat-square)](https://travis-ci.org/SplittyDev/evee.js)

# evee.js
The blazing fast es6 event library.

Evee is a lightweight event library, written in clean ECMAScript6.

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

You can also keep track of your event listeners   
and even unsubscribe from events! :)
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

Here's a nice pattern to write one-shot events:
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'say' event
evee.once('say', e => console.log('hello, world'));

// Dispatch the 'say' event two times
evee.times('say', 2);

// hello, world is only printed once!
```

As you can see, evee is really easy to use!   
Start using evee today and fire events at nearly the speed of light<sup>1</sup> :)


<sup>1</sup> <sub>This is probably not true, but who knows.</sub>
