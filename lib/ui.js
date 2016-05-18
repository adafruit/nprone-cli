'use strict';

const EventEmitter = require('events'),
      keypress = require('keypress');

class UI extends EventEmitter {

  constructor() {

    super();

    this.state = {
      skip: false,
      pause: false,
      rewind: false,
      interesting: false,
      volumeup: false,
      volumedown: false
    };

    if(process.platform == 'linux' && process.arch == 'arm')
      this.mprInit();

    this.keyboardInit();

  }

  keyboardInit() {

    keypress(process.stdin);

    process.stdin.on('keypress', (ch, key) => {
      if(key && key.name == 'right') this.skip();
      if(key && key.name == 'left') this.rewind();
      if(key && key.name == 'up') this.volumeup();
      if(key && key.name == 'down') this.volumedown();
      if(key && key.name == 'space') this.pause();
      if(key && key.name == 'i') this.interesting();
      if(key && key.ctrl && key.name == 'c') process.exit();
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

  }

  mprInit() {

    const MPR121 = require('mpr121'),
          touch = new MPR121(0x5A, 1);

    touch.begin();

    setTimeout(() => {

      if(! touch.ready) return;

      setInterval(() => {
        this.skip(touch.is_touched(0));
        this.pause(touch.is_touched(1));;
        this.rewind(touch.is_touched(2));
        this.interesting(touch.is_touched(3));
        this.volumeup(touch.is_touched(4));
        this.volumedown(touch.is_touched(5));
      }, 100);

    }, 100);

  }

  handleChange(type, pressed) {

    if(typeof pressed == 'undefined')
      return this.emit(type);

    if(pressed && !this.state[type])
      this.emit(type);

    this.state[type] = pressed;

  }

  skip(pressed) {
    this.handleChange('skip', pressed);
  }

  pause(pressed) {
    this.handleChange('pause', pressed);
  }

  rewind(pressed) {
    this.handleChange('rewind', pressed);
  }

  interesting(pressed) {
    this.handleChange('interesting', pressed);
  }

  volumeup(pressed) {
    this.handleChange('volumeup', pressed);
  }

  volumedown(pressed) {
    this.handleChange('volumedown', pressed);
  }

}

exports = module.exports = UI;
