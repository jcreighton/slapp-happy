var config = require('./config');

var Slack = require('slack-node');
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
  console.log('setControls');
  var controls = this.state.controls;
  var i;

  for (i = 0; i < controls.length; i++) {
    this.postReaction(controls[i]);
  }
};

UI.prototype.postUI = function(opts) {
  slack.api('chat.postMessage', {
    text: opts.text,
    channel: this.state.channel
  }, opts.onComplete);
};

UI.prototype.postReaction = function(reaction) {
  console.log('postReaction');
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

};

module.exports = UI;