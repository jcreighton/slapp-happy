var config = require('./config');

var Slack = require('slack-node');
var WebSocketClient = require('websocket').client;
var _ = require('lodash-node');

var slack = new Slack(config.key);
var socket = new WebSocketClient();
var ev = require('./emitter.js');

var Slapp = require('./slapp.js');
var register = require('./register.js');

// Do we only care about certain type of responses? I would guess, yes.
// Subscribe to those we care about.
var messageTypes = ['message', 'reaction_added', 'reaction_removed'];

var handleSlappMessage = function(data) {
  // Break message into slapp request, command, options
  var message = data.text.split(' ');
  var isSlappRequest = message[0] === 'slapp';

  if (isSlappRequest) {
    data.app = message[1];
    data.options = message[2];
    return data;
  }

  return isSlappRequest;
};

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
    var isValidType = (index >= 0);

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
ev.on('slapp_message', function(res) {
  var data = handleSlappMessage(res);

  if (data) {
    ev.emit(data.app, data);
  }
});

ev.on('slapp_reaction_added', function(res) {
  ev.emit('reaction_added_' + res.item.channel + '_' + res.item.ts, res);
});





// Test Slapps
register.slapp({
  keyword: 'vote',
  text: 'Let\'s vote!',
  type: 'numbered_list'
});

register.slapp({
  keyword: 'checklist',
  text: 'Let\'s get shit done:',
  type: 'checklist'
});

register.slapp({
  keyword: 'buffalo',
  text: 'Roaming the open plain',
  type: 'custom',
  controls: ['dog', 'cookie'],
  template: function() {
    var layout = 'This is a test.';
    var controls = ['dog', 'walking'];

    return {
      layout: layout,
      controls: controls
    }
  }
});

