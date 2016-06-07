#!/usr/bin/env node
'use strict';

process.title = 'npr-one';

if(process.platform != 'linux' && process.platform != 'darwin') {
  console.error('Your platform is not currently supported');
  process.exit(1);
}

const AutoUpdate = require('cli-autoupdate'),
      exec = require('child_process').exec,
      NPR = require('npr-api'),
      chalk = require('chalk'),
      auth = require('./lib/auth'),
      fs = require('fs'),
      path = require('path'),
      Player = require('./lib/player'),
      Story = require('./lib/story'),
      UI = require('./lib/ui');

let pkg = require('./package.json');

const logo = fs.readFileSync(path.join(__dirname,'logo.txt'), 'utf8');
console.log(logo);
console.log('checking for update...');

if(process.platform == 'linux' && process.arch == 'arm')
  exec('./install-service');

const update = new AutoUpdate(pkg);

update.on('error', (err) => { console.error('update failed.'); launch(); });
update.on('update', () => console.log('updating...'));
update.on('finish', () => launch());

const launch = function() {

  const npr = new NPR(),
        story = new Story(npr),
        player = new Player();

  console.log('connecting to npr one...');

  // silence swagger log output
  process.env.NODE_ENV = 'test';

  npr.one
     .init()
     .then(auth.getToken.bind(auth, npr))
     .then((token) => {
       process.stdout.write('\x1B[2J');
       process.stdout.write('\x1B[0f');
       console.log(logo);
       return npr.one.setAccessToken(token);
     })
     .then(story.getRecommendations.bind(story))
     .then(player.load.bind(player))
     .then(() => {
       const ui = new UI();
       ui.on('skip', player.skip.bind(player));
       ui.on('pause', player.pause.bind(player));
       ui.on('rewind', player.rewind.bind(player));
       ui.on('interesting', player.interesting.bind(player));
       ui.on('volumeup', player.increaseVolume.bind(player));
       ui.on('volumedown', player.decreaseVolume.bind(player));
     })
     .catch(function(err) {
       console.error(err, err.stack);
     });

};

