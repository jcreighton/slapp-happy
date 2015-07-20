var Slapp = require('./slapp.js');
var Templates = require('./templates.js');
var ev = require('./emitter.js');


// Registers apps & templates
var Register = function() {
  this.registry = {};
};

// TODO: This should probably be a singleton
Register.prototype.slapp = function(options) {
  var _this = this;

  // Save options
  this.registry[options.keyword] = options;

  // Set on listener to create new Slapp on event
  ev.on(options.keyword, function(data) {
    // Merge data & options
    new Slapp({
      options: _this.registry[options.keyword],
      data: data
    });
  });
};

module.exports = new Register();