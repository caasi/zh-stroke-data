(function() {
  var $, isCanvasSupported;

  isCanvasSupported = function() {
    var _ref;
    return (_ref = document.createElement("canvas")) != null ? _ref.getContext("2d") : void 0;
  };

  $ = jQuery;

  $.fn.extend({
    strokeWords: function(words, options) {
      if (words === void 0 || words === "") {
        return null;
      }
      options = $.extend({
        svg: !isCanvasSupported()
      }, options);
      return this.each(function() {
        if (options.svg) {
          return window.WordStroker.raphael.strokeWords(this, words);
        } else {
          return window.WordStroker.canvas.createWordsAndViews(this, words).forEach(function(word) {
            return word.draw();
          });
        }
      }).data("strokeWords", {
        play: null
      });
    }
  });

}).call(this);

/*
//@ sourceMappingURL=jquery.stroke-words.js.map
*/