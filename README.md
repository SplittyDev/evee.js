[![npm](https://img.shields.io/npm/v/evee.svg?maxAge=2592000?style=flat-square)]()

# evee.js
The blazing fast es6 event library.

Evee is a lightweight event library, written in clean ECMAScript6.

## How to use
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'onUpdate' event
evee.subscribe('onUpdate', e => {
  console.log('Ticks: ' + e.data);
});

var ticks = 0;
while(true) {

  // Dispatch the 'onUpdate' event
  evee.dispatch('onUpdate', ++ticks);
}
```

You can also keep track of your event listeners   
and even unsubscribe from events! :)
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'onSomething' event
var receiver = evee.subscribe('onSomething', e => {
  console.log(e.data);
});

// Dispatch the 'onSomething' event
evee.dispatch('onSomething', 'Hello, world!');

// Unsubscribe from the 'onSomething' event
evee.unsubscribe(receiver);
```

Here's a nice pattern to write one-shot events:
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'oneShot' event
evee.subscribe('oneShot', e => {

    // Print hello, world
    console.log('hello, world');

    // Unsubscribe
    evee.unsubscribe(e.sender);
});

// Dispatch the 'oneShot' event two times
evee.dispatch('oneShot');
evee.dispatch('oneShot');

// hello, world is only printed once!
```

As you can see, evee is really easy to use!   
Start using evee today and fire events at nearly the speed of light<sup>1</sup> :)


<sup>1</sup> <sub>This is probably not true, but who knows.</sub>
