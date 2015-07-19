var config = require('./config');

var Slack = require('slack-node');
// var Promise = require('promise');
var Templates = require('./templates.js');

var slack = new Slack(config.key);

// UI object controls the Slapp user interface
// Updates & maintains the UI

var UI = function(options) {
  var defaults = {
    rows: 0,
    type: 'basic_list',
    action: 'list_out'
  };

  this.options = options;

  this.state = {};
};

UI.prototype.setUI = function(data) {
  this.data = data;
  this.state.channel = data.channel;
  this.state.ui = this.buildUI();

  var handleResponse = function(err, response){
    if (err) {
      console.log(err);
    }

    if (response.ok === true) {
      this.state.ts = response.ts;
      this.state.text = response.text;

      this.setControls();
    }
  };

  this.postUI({
    text: this.state.ui,
    onComplete: handleResponse.bind(this)
  });
};

UI.prototype.buildUI = function() {
  var greeting = this.options.text;
  this.state.app = this.data.app;
  this.state.options = this.data.options.split(',');
  this.state.start = greeting + '\n';

  var template = Templates[this.options.type](this.state.start, this.state.options);
  this.state.controls = template.controls;

  return template.layout;
};

UI.prototype.setControls = function() {
  var controls = this.state.controls.concat(['four', 'five', 'six']);

  var _this = this;

  var addReaction = function(reaction) {
    return new Promise(function(resolve, reject) {
      slack.api('reactions.add', {
        name: reaction,
        channel: _this.state.channel,
        timestamp: _this.state.ts
      }, function(err, response) {
        if (err) {
          reject(err);
        }

        if (response) {
          resolve(response);
        }
      });
    });
  };

  var promiseSequence = function(arr, promiseFn, onComplete) {
    return arr.reduce(function(sequence, item) {
      return sequence.then(function() { return promiseFn(item); });
    }, Promise.resolve());
  };

  promiseSequence(controls, addReaction);
};

UI.prototype.postUI = function(opts) {
  slack.api('chat.postMessage', {
    text: opts.text,
    channel: this.state.channel
  }, opts.onComplete);
};

UI.prototype.postReaction = function(reaction) {
  slack.api('reactions.add', {
    name: reaction,
    channel: this.state.channel,
    timestamp: this.state.ts
  }, function(err, response) {
    if (err) {
      console.log(err);
    }

    if (response) {
      console.log(response);
    }
  });
};

UI.prototype.updateUI = function() {
  slack.api('chat.update', {
    channel: this.state.channel,
    ts: this.state.ts,
    text: 'Update'
  });
};

module.exports = UI;