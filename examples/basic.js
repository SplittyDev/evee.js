import Evee from 'evee'
const evee = new Evee()

// handle the 'say' event
evee.on('say', e => console.log(e.data));

// delay for 1200ms and then fire the event
setTimeout(() => evee.emit('say', 'hello from evee.js!'), 1200);
