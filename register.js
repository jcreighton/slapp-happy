var Slapp = require('./slapp.js');
var ev = require('./emitter.js');

var Register = function() {
  this.registry = {};
};

// TODO: This should probably be a singleton
Register.prototype.slapp = function(options) {
  // Save options
  this.registry[options.keyword] = options;

  // Set on listener to create new Slapp on event
  ev.on(options.keyword, function(data) {
    // Merge data & options
    new Slapp({
      options: options,
      data: data
    });
  });
};

module.exports = Register;