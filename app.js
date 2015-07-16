// Abstract basic commands & utilities
var App = function(options) {
  this.options = options;
};

App.prototype.postMessage = function(opts, onComplete) {
  slack.api('chat.postMessage', {
    text: opts.text,
    channel: opts.channel
  }, onComplete);
};

App.prototype.updateMessage = function() {

};

App.prototype.addReaction = function() {

};

App.prototype.removeReaction = function() {

};