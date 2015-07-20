// Add Emoji templates here!
var emojiTemplates = {
  numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten'],
  checklist: { unchecked: 'white_medium_square', checked: 'ballot_box_with_check' }
};


// Add your templates here!
var Templates = {
  numbered_list: function(start, options) {
    var numbers = emojiTemplates.numbers;
    var controls = [];
    var i;

    var layout = options.reduce(function(collector, option, i) {
      var number = numbers[i];
      controls.push(emoji);
      return collector + ':' + number + ': ' + option + '\n';
    }, start);

    return {
      layout: layout,
      controls: controls
    };
  },
  checklist: function (start, options) {
    var unchecked = emojiTemplates.checklist.unchecked;
    var numbers = emojiTemplates.numbers;
    var controls = [];
    var i;

    var layout = options.reduce(function(collector, option, i) {
      var number = numbers[i];
      controls.push(number);
      return collector + ':' + number + ': ' + ':' + unchecked + ': ' + option + '\n';
    }, start);

    return {
      layout: layout,
      controls: controls
    }
  },
  custom: function() {
    var layout = 'This is a test.';
    var controls = ['dog', 'walking'];

    return {
      layout: layout,
      controls: controls,
    }
  }
};

module.exports = Templates;