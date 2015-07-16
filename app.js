var App = function(options) {
  this.options = options;
};

App.prototype.postMessage = function(opts) {
  slack.api('chat.postMessage', {
    text: opts.text,
    channel: opts.channel
  }, function(err, response){
    console.log(response);
  });
};

App.prototype.updateMessage = function() {

};

App.prototype.addReaction = function() {

};

App.prototype.removeReaction = function() {

};