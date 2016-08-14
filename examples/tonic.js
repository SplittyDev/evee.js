'use strict';
var Evee = require('evee.compatible'),
    evee = new Evee();

evee.on('say', e => window.alert(e.data));
evee.emit('say', 'hello from evee.js!');
