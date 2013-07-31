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
        var i, next, strokers;
        if (options.svg) {
          return window.WordStroker.raphael.strokeWords(this, words);
        } else {
          strokers = window.WordStroker.canvas.createWordsAndViews(this, words);
          strokers.forEach(function(stroker) {
            return stroker.drawBackground();
          });
          i = 0;
          next = function() {
            if (i < strokers.length) {
              return strokers[i++].draw().then(next);
            }
          };
          return next();
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