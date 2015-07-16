// Add your templates here!
var Templates = {
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

module.exports = Templates;