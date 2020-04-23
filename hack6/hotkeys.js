'use strict';

const ioHook = require('iohook');
const open = require('open');

const CTRL = 29;
const F7 = 65;
const G = 34;

// Google hotkey
ioHook.registerShortcut([F7], async () => {
  try {
    console.log('hotkey');
    await open('https://google.com/', {browser: 'google chrome'});
  }
  catch (error) {
    console.error('Google ctrl+g hook error', error);
  }
});


ioHook.start(true);
