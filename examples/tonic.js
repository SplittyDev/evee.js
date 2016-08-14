// HINT: Switch to Node 6 if the example does not work :)

'use strict';
var Evee = require('evee'),
    evee = new Evee();

evee.on('say', e => console.log(e.data));
console.log('wait for it...');
setTimeout(() => evee.emit('say', 'hello from evee.js!'), 1200);
