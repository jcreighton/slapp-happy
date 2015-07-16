var key = 'xoxb-7614585861-00ax4Gyu42U6OmeM69cvMMIH';

var Slack = require('slack-node');
var WebSocketClient = require('websocket').client;
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash-node');

var slack = new Slack(key);
var socket = new WebSocketClient();
var ev = new EventEmitter();

// Do we only care about certain type of responses? I would guess, yes.
// Subscribe to those we care about.
var messageTypes = ['message', 'reaction_added', 'reaction_removed'];

var emojiTypes = {
  numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten'],
  checklist: ['ballot_box_with_check', 'white_medium_square']
}

// Connect to Slack's Real Time Messaging API
slack.api('rtm.start', function(error, response) {
  if (error) {
    console.log(error);
    return;
  }

  this.slappId = response.self.id;

  socket.connect(response.url);
});

socket.on('connect', function(connection) {
  console.log('WebSocket Client Connected');

  connection.on('message', function(data) {
    var message = JSON.parse(data.utf8Data);
    var type = message.type;
    var index = messageTypes.indexOf(type);
    var isValidType = (index === -1);

    if ((typeof message.text === 'undefined') && (!isValidType)) {
      return;
    }

    var slappEvent = 'slapp_' + messageTypes[index];

    // Emit event
    ev.emit(slappEvent, message);
  });

  connection.on('error', function(error) {
    console.log(error);
  });

  connection.on('close', function(response, description) {
    console.log(response);
  });
});

// On message, see if it's relevant
// TODO: use messageTypes to generate event listeners
ev.on('slapp_message', function(data) {
  // Break message into slapp request, command, options
  var message = data.text.split(' ');
  var isSlappRequest = message[0] === 'slapp';

  if (isSlappRequest) {
    data.app = message[1];
    data.options = message[2];

    ev.emit(data.app, data);
  }
});

ev.on('slapp_reaction_added', function(data) {

});

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
  this.data = data;

  // Merge options with data
  this.ui.setUI(this.data);
};

Slapp.prototype.postMessage = function() {
  slack.api('chat.postMessage', {
    text: this.options.text,
    channel: this.data.channel
  }, function(err, response){
    console.log(response);
  });
};

Slapp.prototype.getKeyword = function() {
  return this.options.keyword;
};


// UI object controls the Slapp user interface
var UI = function(options) {
  var defaults = {
    rows: 0,
    type: 'basic_list',
    action: 'list_out'
  };

  this.options = options;

  this.state = {};

  this.templates = {
    numbered_list: function(start, options) {
      var numbers = emojiTypes.numbers;
      var controls = [];
      var i;

      for (i = 0; i < options.length; i++) {
        var emoji = numbers[i];
        controls.push(emoji);
        start += ':' + emoji + ': ' + options[i] + '\n';
      }

      return {
        layout: start,
        controls: controls
      };
    },
    checklist: function () {

    },
    custom_list: function() {

    }
  };
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
  var template = this.templates[this.options.type](this.state.start, this.state.options);
  this.state.controls = template.controls;

  return template.layout;
};

UI.prototype.setControls = function() {
  console.log('setControls');
  this.postReaction();
};

UI.prototype.postUI = function(opts) {
  slack.api('chat.postMessage', {
    text: opts.text,
    channel: this.state.channel
  }, opts.onComplete);
};

UI.prototype.postReaction = function() {
  console.log('postReaction');
  slack.api('reactions.add', {
    name: 'cookie',
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


// Test Slapps
var voteSlapp = new Slapp({  //slapp vote one,two,three
  keyword: 'vote',
  text: 'Let\s vote!',
  type: 'numbered_list'
});

var buffaloSlapp = new Slapp({
  keyword: 'buffalo',
  text: 'Roaming the open plain'
});

var toDoSlapp = new Slapp({
  keyword: 'todo',
  text: 'Let\'s get shit done!'
});

// { type: 'message',
//   channel: 'G07J2CBH8',
//   user: 'U03LPH69K',
//   text: 'slapp vote one,two,three',
//   ts: '1436982046.000009',
//   team: 'T0259B10F',
//   appType: 'vote',
//   command: 'one,two,three' }

// { type: 'reaction_added',
//   user: 'U03LPH69K',
//   item:
//    { type: 'message',
//      channel: 'G07J2CBH8',
//      ts: '1436993948.000103' },
//   reaction: 'cookie',
//   event_ts: '1436993956.020219' }

//Slapp object
  // Initializes & passes on configs
  // Listens for keyword

// Controls object
  // Build out buttons for controls & set event listeners/actions

// Board object
  // Builds out the board/space
  // Maintains/updates
