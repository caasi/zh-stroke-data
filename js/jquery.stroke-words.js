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
<<<<<<< HEAD:js/jquery.stroke-words.js
        var promises;
=======
        var i, next, promises;
>>>>>>> 4b99a414cddefd9b8076f09090bd88ddfdfe05b4:jquery.stroke-words.js
        if (options.svg) {
          return window.WordStroker.raphael.strokeWords(this, words);
        } else {
          promises = window.WordStroker.canvas.createWordsAndViews(this, words, options);
          promises.forEach(function(p) {
            return p.then(function(word) {
              return word.drawBackground();
            });
          });
<<<<<<< HEAD:js/jquery.stroke-words.js
          return promises.reduceRight(function(next, current) {
            return function() {
              return current.then(function(word) {
                return word.draw().then(next);
              });
            };
          }, null)();
=======
          i = 0;
          next = function() {
            if (i < promises.length) {
              return promises[i++].then(function(word) {
                return word.draw().then(next);
              });
            }
          };
          return next();
>>>>>>> 4b99a414cddefd9b8076f09090bd88ddfdfe05b4:jquery.stroke-words.js
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