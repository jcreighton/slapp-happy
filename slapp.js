var config = require('./config');

var Slack = require('slack-node');

var UI = require('./ui.js');
var ev = require('./emitter.js');
var slack = new Slack(config.key);

// Configures UI & Interactions
// Handles custom setups
// Handles error states/communication between user & Slapp
// Set listeners for custom app initializer

var Slapp = function(options) {
  this.options = options;

  // New UI
  this.ui = new UI({
    text: this.options.text,
    type: this.options.type,
    action: this.options.action
  });

  ev.on(this.options.keyword, this.createSlapp.bind(this));
};

Slapp.prototype.createSlapp = function(data) {
  console.log('createSlapp');
  this.data = data;

  // Merge options with data?
  this.ui.setUI(this.data);
};

Slapp.prototype.getKeyword = function() {
  return this.options.keyword;
};

module.exports = Slapp;