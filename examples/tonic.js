'use strict';
var Evee = require('evee'),
    evee = new Evee();

evee.on('say', e => console.log(e.data));

// delay for 1200ms and then fire the event
setTimeout(() => evee.emit('say', 'hello from evee.js!'), 1200);
