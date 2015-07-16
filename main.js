var config = require('./config');

var Slack = require('slack-node');
var WebSocketClient = require('websocket').client;
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash-node');

var slack = new Slack(config.key);
var socket = new WebSocketClient();
var ev = new EventEmitter();

var Slapp = require('./slapp.js');

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

// Controls object
  // Build out buttons for controls & set event listeners/actions
