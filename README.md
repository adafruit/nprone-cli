# NPR One CLI

This is a simple command line based NPR One client for OS X and Linux.

## Installation

This package requires the latest stable version of [Node.js](https://nodejs.org) (v6.0 or higher).

```sh
$ node -v
v6.2.0
```

Install `mplayer` on OS X using [homebrew](http://brew.sh/):

```
$ brew install mplayer
```

Install `mplayer` on Linux:

```
$ sudo apt-get install -y mplayer
```

Make sure you have the latest stable [node.js](https://nodejs.org/en/) installed (4.0 or higher), and then run:

```
npm install -g npr-one
```

## Usage

Sign into the [NPR Dev Console](http://dev.npr.org/), create a new app, and record your App ID & Secret.
To authorize the CLI sign into [NPR Activate Console](http://www.npr.org/oauth2/device/activate) and provide the recorded information.
The audio player will save your authorization and begin playing.

```
$ npr-one

\\\\\\\\\\\\\\\\\\\\\\\\\\\>>>>>>>>>>>>>>>>>>>>>>>>>> \\\\\\\\\\\\\\\\\\\\\\\\\\
\\\\\\\\\\\\\\\\\\\\\\\\\\\>>>>>>>>>>>>>>>>>>>>>>>>>> \\\\\\\\\\\\\\\\\\\\\\\\\\
\\\\\\\\\\\\\>>\\\\\\\\\\\\>>>>>>>>>>>>>>>>>>>>>>>>>> \\\\\\\\\\\\\\>>>\\\\\\\\\
\\\\\\\           >\\\\\\\\>>>>>>>          \>>>>>>>> \\\\\\\\         (\\\\\\\\
\\\\\\\   .>>>>=   \\\\\\\\>>>>>>>   =>>>>    >>>>>>> \\\\\\\\    (>>>>\\\\\\\\\
\\\\\\\   )\\\\\   (\\\\\\\>>>>>>>   >>>>>>   )>>>>>> \\\\\\\\   .\\\\\\\\\\\\\\
\\\\\\\   )\\\\\   (\\\\\\\>>>>>>>   >>>>>>   )>>>>>> \\\\\\\\   )\\\\\\\\\\\\\\
\\\\\\\   )\\\\\   (\\\\\\\>>>>>>>   >>>>>\   >>>>>>> \\\\\\\\   )\\\\\\\\\\\\\\
\\\\\\\   )\\\\\   (\\\\\\\>>>>>>>          ->>>>>>>> \\\\\\\\   )\\\\\\\\\\\\\\
\\\\\\\>>>>\\\\\>>>>\\\\\\\>>>>>>>   >>>>(>>>>>>>>>>> \\\\\\\\>>>>\\\\\\\\\\\\\\
\\\\\\\\\\\\\\\\\\\\\\\\\\\>>>>>>>   >>>>>>>>>>>>>>>> \\\\\\\\\\\\\\\\\\\\\\\\\\
\\\\\\\\\\\\\\\\\\\\\\\\\\\>>>>>>>===>>>>>>>>>>>>>>>> \\\\\\\\\\\\\\\\\\\\\\\\\\

[downloaded] WYPR FM
[downloaded] NPR thanks our sponsors
[playing] WYPR FM
[downloaded] Welcome To Czechia: Czech Republic Looks To Adopt Shorter Name
[downloaded] Belgian Transport Minister Resigns Over Airport Security Debate
[downloaded] Tax Season
[downloaded] Adapting To A More Extreme Climate, Coastal Cities Get Creative
[downloaded] NPR thanks our sponsors
```

Screenshot of Terminal in with Color:
![nprone-cli in color terminal](/NPR_Terminal.png?raw=true "nprone-cli in color terminal")

### Keyboard Controls

```
space   play/pause
↑       volume up
↓       volume down
←       rewind 15 seconds
→       skip to the next story
i       mark as interesting
```

## License

Copyright (c) 2016 Adafruit Industries. Licensed under the MIT license.

The NPR logo is a registered trademark of NPR used with permission from NPR.  All rights reserved.
