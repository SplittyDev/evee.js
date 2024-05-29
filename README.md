[![MIT License](https://badgers.space/github/license/SplittyDev/evee.js)](./LICENSE.md)
[![Evee on NPM](https://badgers.space/npm/name/evee)](https://npmjs.com/package/evee)

# evee.js
The blazing fast event library 🔥

Evee is a lightweight event library, written in just ~200 lines of JavaScript.  
Evee exports ESM, CommonJS and Browser globals, so you can use it in any environment.

## How to install
```sh
npm install evee # if you're using NPM
yarn add evee # if you're using Yarn
```

## Introducing Evee 3
Evee now natively supports ESM and CommonJS.

We export two things:
- `Evee` (default export): The class you can use to create new instances of Evee.
- `evee` (named export): A pre-made instance of Evee so you can immediately start using it.

If you're planning to use Evee in NodeJS, you can now import it like this:
```js
import Evee, { evee } from 'evee'; // If you're using ESM (import/export)
const { default: Evee, evee } = require('evee'); // If you're using CommonJS (require)
```

If you're planning to use Evee in the browser, you can now import it like this:
```html
<!-- ESM if you're targeting modern browsers -->
<script type="module">
  import Evee, { evee } from 'https://cdn.jsdelivr.net/npm/evee@3';
</script>

<!-- Global export if you're targeting older browsers -->
<script src="https://cdn.jsdelivr.net/npm/evee@3/dist/browser/index.min.js"></script>
<script>
  // You can use the `Evee` (class) and `evee` (instance) globals here
</script>
```

## How to use
```js
import { evee } from 'evee'

// Subscribe to the 'update' event
evee.on('update', e => console.log(`Received event #${e.data}`))

for (let i = 0; i < 100; i++) {

  // Dispatch the 'update' event
  evee.emit('update', i);
}
```

You can also keep track of your event listeners unsubscribe from events you don't need anymore.

```js
import { evee } from 'evee'

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
import { evee } from 'evee'

// Subscribe to the 'say' event
evee.once('say', e => console.log('hello, world'));

// Dispatch the 'say' event two times
evee.signal('say');
evee.signal('say');

// hello, world is only printed once!
```

As you can see, evee is really easy to use!   
Start using evee today and stop worrying about slow events :)