'use strict';

const rimraf = require('rimraf'),
      touch = require('touch'),
      fs = require('fs'),
      url = require('url'),
      S = require('string'),
      Gauge = require('gauge'),
      chalk = require('chalk'),
      wget = require('wget-improved');

class Story {

  constructor(npr) {

    this.npr = npr;
    this.recommendations = [];
    this.completed = [];
    this.ratings = [];
    this.current = null;

  }

  download(rec) {

    return new Promise((resolve, reject) => {

      const filename = `/tmp/npr-${rec.attributes.uid}`;

      try {
        fs.accessSync(filename);
        rec.file = filename;
        rec.downloaded = true;
        rec.downloading = false;
        rec.download = Promise.resolve(rec);
        console.log(`${chalk.red.bgBlack('[downloaded]')} ${rec.attributes.title}`);
        return resolve(rec);
      } catch(e) {}

      touch.sync(`/tmp/npr-${rec.attributes.uid}`);
      rec.file = filename;
      rec.downloading = true;

      const bar = new Gauge(process.stderr, {
        cleanupOnExit: false,
        template: [
          {value: chalk.green.bgBlack('[download]'), kerning: 1},
          {type: 'section', kerning: 1, length: 20},
          {type: 'progressbar' }
        ]
      });

      wget.download(rec.links.audio[0].href, rec.file)
          .on('error', reject)
          .on('progress', (progress) => {
            bar.show(rec.attributes.title, progress);
          })
          .on('end', () => {
            bar.disable();
            console.log(`${chalk.red.bgBlack('[downloaded]')} ${rec.attributes.title}`);
            rec.downloaded = true;
            rec.downloading = false;
            resolve(rec);
          });

    });

  }

  fetchNew() {

    var next = this.recommendations.find((rec) => {
      return !rec.file && !rec.downloaded && !rec.downloading;
    });

    if(! next) return;

    next.download = this.download(next);
    next.download.then(() => this.fetchNew());

    return next.download;

  }

  getRecommendations() {

    return this.npr.one.listening.getRecommendations({ channel: 'npr' })
    .then((rec) => {
      this.recommendations = rec.items;
      return this.fetchNew();
    })
    .then(() => this.recommendations[1].download)
    .then(() => {
      this.current = this.recommendations.shift();
      return this;
    });

  }

  sendRatings() {

    let args = url.parse(this.current.links.recommendations[0].href, true).query;
    args.body = this.ratings;

    return this.npr.one.listening.postRating(args)
      .then((res) => {
        res.items.forEach((rec) => {
          if(this.checkExisting(rec)) return;
          this.recommendations.push(rec);
        });

        this.ratings = [];

        return this.fetchNew();

      })
      .catch(() => {});

  }

  checkExisting(rec) {

    if(rec.attributes.uid == this.id) return true;
    if(rec.attributes.type == 'stationId') return true;

    const exists = this.recommendations.find((existing) => {
      return rec.attributes.uid == existing.attributes.uid;
    });

    const completed = this.completed.find((existing) => {
      return rec.attributes.uid == existing.attributes.uid;
    });

    if(exists || completed)
      return true;

    return false;

  }

  get id() {
    return this.current.attributes.uid;
  }

  get file() {
    return this.current.file;
  }

  get skipped() {
    return this.current.skipped;
  }

  get canSkip() {
    return this.current.attributes.skippable;
  }

  get interesting() {
    return this.current.interesting;
  }

  get title() {
    return this.current.attributes.title;
  }

  get rating() {
    return Object.assign({}, this.current.attributes.rating);
  }

  start() {

    const rating = this.rating;
    rating.timestamp = (new Date()).toISOString();

    this.ratings.push(rating);

    this.sendRatings();

    if(this.current.downloaded)
      return Promise.resolve(this.file);

    if(! this.current.downloading)
      this.current.download = this.download(this.current);

    return this.current.download.then(rec => rec.file);

  }

  markInteresting(sec) {

    if(this.interesting) return;

    const rating = this.rating;

    rating.rating = 'THUMBSUP';
    rating.elapsed = sec;
    rating.timestamp = (new Date()).toISOString();
    this.ratings.push(rating);

    this.current.interesting = true;

  }

  next(sec) {

    const rating = this.rating;

    rating.rating = 'SKIP';
    rating.elapsed = Math.floor(sec);
    rating.timestamp = (new Date()).toISOString();
    this.ratings.push(rating);

    this.current.skipped = true;

  }

  finished() {

    const rating = this.rating;

    if(! this.skipped) {
      rating.rating = 'COMPLETED';
      rating.elapsed = rating.duration;
      rating.timestamp = (new Date()).toISOString();
      this.ratings.push(rating);
    }

    rimraf(this.file, ()=>{});
    this.completed.push(this.current);
    this.current = this.recommendations.shift();

  }

}

exports = module.exports = Story;
