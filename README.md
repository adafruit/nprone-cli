# NPR One CLI

This is a simple command line based NPR One client for OS X and Linux.

## Installation

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

Sign into the [NPR Dev Console](http://dev.npr.org/) and enter your App ID & Secret. The audio player
will save your authorization and begin playing.

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

### Keyboard Controls

```
space   play/pause
↑       volume up
↓       volume down
←       rewind 15 seconds
→       skip to the next story
i       mark as interesting
```
