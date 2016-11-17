'use strict';

// The `Evee` export is for universally supported ES5 targets,
// the `Evee6` export is for ES6 targets and is generally faster.
const evee = require('evee').Evee;

// register the `say` event
evee.on('say', e => console.log(e.data));

// delay for 1200ms and then fire the event
setTimeout(() => evee.emit('say', 'hello from evee.js!'), 1200);
