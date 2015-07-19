// Add Emoji templates here!
var emojiTemplates = {
  numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten'],
  checklist: ['ballot_box_with_check', 'white_medium_square']
};


// Add your templates here!
var Templates = {
  numbered_list: function(start, options) {
    var numbers = emojiTemplates.numbers;
    var controls = [];
    var i;

    var layout = options.reduce(function(collector, option, i) {
      var emoji = numbers[i];
      controls.push(emoji);
      return collector + ':' + emoji + ': ' + option + '\n';
    }, start);

    return {
      layout: layout,
      controls: controls
    };
  },
  checklist: function () {

  },
  custom_list: function() {

  }
};

module.exports = Templates;