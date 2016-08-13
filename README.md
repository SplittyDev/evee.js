[![npm](https://img.shields.io/npm/v/evee.svg?maxAge=2592000?style=flat-square)]()

# evee.js
The blazing fast es6 event library.

Evee is a lightweight event library, written in clean ECMAScript6.

## How to use
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'update' event
// Hint: 'on' is synonym for 'subscribe'
evee.on('update', e => {
  console.log('Ticks: ' + e.data);
});

var ticks = 0;
while(true) {

  // Dispatch the 'update' event
  evee.dispatch('update', ++ticks);
}
```

You can also keep track of your event listeners   
and even unsubscribe from events! :)
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'say' event
// Hint: 'subscribe' is synonym for 'on'
var receiver = evee.subscribe('say', e => console.log(e.data));

// Dispatch the 'say' event
evee.dispatch('say', 'Hello, world!');

// Unsubscribe from the 'say' event
evee.unsubscribe(receiver);
```

Here's a nice pattern to write one-shot events:
```js
// Grab a new evee instance
var Evee = require('evee'),
    evee = new Evee();

// Subscribe to the 'say' event
evee.once('say', e => console.log('hello, world'));

// Dispatch the 'say' event two times
evee.dispatch('say');
evee.dispatch('say');

// hello, world is only printed once!
```

As you can see, evee is really easy to use!   
Start using evee today and fire events at nearly the speed of light<sup>1</sup> :)


<sup>1</sup> <sub>This is probably not true, but who knows.</sub>
