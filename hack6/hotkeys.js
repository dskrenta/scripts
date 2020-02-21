'use strict';

const ioHook = require('iohook');
const open = require('open');

ioHook.start();

const CTRL = 29;
const F7 = 65;
const G = 34;

// Google hotkey
ioHook.registerShortcut([CTRL, G], async () => {
  try {
    await open('https://google.com/');
  }
  catch (error) {
    console.error('Google ctrl+g hook error', error);
  }
});