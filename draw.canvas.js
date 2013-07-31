(function() {
  $(function() {
    var Word, config, createWordAndView, createWordsAndViews, drawBackground, fetchStrokeXml, parseOutline, parseTrack, pathOutline;
    fetchStrokeXml = function(code, cb) {
      return $.get("utf8/" + code.toLowerCase() + ".xml", cb, "xml");
    };
    config = {
      scale: 0.4,
      styleScale: 0.25,
      dim: 2150,
      trackWidth: 150,
      updatesPerStep: 10
    };
    Word = function(val) {
      this.val = val;
      this.utf8code = escape(val).replace(/%u/, "");
      this.strokes = [];
      return this.init();
    };
    Word.prototype.init = function() {
      this.currentStroke = 0;
      this.currentTrack = 0;
      return this.time = 0.0;
    };
    Word.prototype.drawBackground = function(ctx) {
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, config.dim * config.scale, config.dim * config.scale);
      return drawBackground(ctx);
    };
    Word.prototype.draw = function(ctx) {
      var step, that;
      that = this;
      this.init();
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#000";
      ctx.lineWidth = 5;
      step = function() {
        that.update(ctx);
        return setTimeout(step, 250);
      };
      requestAnimationFrame(step);
      return this.promise = $.Deferred();
    };
    Word.prototype.update = function(ctx) {
      var i, stroke, _i, _ref,
        _this = this;
      if (this.currentStroke >= this.strokes.length) {
        return;
      }
      stroke = this.strokes[this.currentStroke];
      if (this.time === 0.0) {
        this.vector = {
          x: stroke.track[this.currentTrack + 1].x - stroke.track[this.currentTrack].x,
          y: stroke.track[this.currentTrack + 1].y - stroke.track[this.currentTrack].y,
          size: stroke.track[this.currentTrack].size
        };
        ctx.save();
        ctx.beginPath();
        pathOutline(ctx, stroke.outline);
        ctx.clip();
      }
      for (i = _i = 1, _ref = config.updatesPerStep; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.time += 0.02;
        if (this.time >= 1) {
          this.time = 1;
        }
        ctx.beginPath();
        ctx.arc((stroke.track[this.currentTrack].x + this.vector.x * this.time) * config.scale, (stroke.track[this.currentTrack].y + this.vector.y * this.time) * config.scale, (this.vector.size * 2) * config.scale, 0, 2 * Math.PI);
        if (this.time >= 1) {
          break;
        }
      }
      ctx.fill();
      if (this.time >= 1.0) {
        ctx.restore();
        this.time = 0.0;
        this.currentTrack += 1;
        if (this.currentTrack >= stroke.track.length - 1) {
          this.currentTrack = 0;
          this.currentStroke += 1;
        }
      }
      if (this.currentStroke >= this.strokes.length) {
        return this.promise.resolve();
      } else {
        return requestAnimationFrame(function() {
          return _this.update(ctx);
        });
      }
    };
    drawBackground = function(ctx) {
      var dim;
      dim = config.dim * config.scale;
      ctx.strokeStyle = "#A33";
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, dim);
      ctx.lineTo(dim, dim);
      ctx.lineTo(dim, 0);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(0, dim / 3);
      ctx.lineTo(dim, dim / 3);
      ctx.moveTo(0, dim / 3 * 2);
      ctx.lineTo(dim, dim / 3 * 2);
      ctx.moveTo(dim / 3, 0);
      ctx.lineTo(dim / 3, dim);
      ctx.moveTo(dim / 3 * 2, 0);
      ctx.lineTo(dim / 3 * 2, dim);
      return ctx.stroke();
    };
    pathOutline = function(ctx, outline) {
      var path, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = outline.length; _i < _len; _i++) {
        path = outline[_i];
        switch (path.type) {
          case "M":
            _results.push(ctx.moveTo(path.x * config.scale, path.y * config.scale));
            break;
          case "L":
            _results.push(ctx.lineTo(path.x * config.scale, path.y * config.scale));
            break;
          case "C":
            _results.push(ctx.bezierCurveTo(path.begin.x * config.scale, path.begin.y * config.scale, path.mid.x * config.scale, path.mid.y * config.scale, path.end.x * config.scale, path.end.y * config.scale));
            break;
          case "Q":
            _results.push(ctx.quadraticCurveTo(path.begin.x * config.scale, path.begin.y * config.scale, path.end.x * config.scale, path.end.y * config.scale));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };
    parseOutline = function(outline) {
      var a, node, path, _i, _len, _ref;
      path = [];
      _ref = outline.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.nodeType !== 1) {
          continue;
        }
        a = node.attributes;
        if (!a) {
          continue;
        }
        switch (node.nodeName) {
          case "MoveTo":
            path.push({
              type: "M",
              x: parseFloat(a.x.value),
              y: parseFloat(a.y.value)
            });
            break;
          case "LineTo":
            path.push({
              type: "L",
              x: parseFloat(a.x.value),
              y: parseFloat(a.y.value)
            });
            break;
          case "CubicTo":
            path.push({
              type: "C",
              begin: {
                x: parseFloat(a.x1.value),
                y: parseFloat(a.y1.value)
              },
              mid: {
                x: parseFloat(a.x2.value),
                y: parseFloat(a.y2.value)
              },
              end: {
                x: parseFloat(a.x3.value),
                y: parseFloat(a.y3.value)
              }
            });
            break;
          case "QuadTo":
            path.push({
              type: "Q",
              begin: {
                x: parseFloat(a.x1.value),
                y: parseFloat(a.y1.value)
              },
              end: {
                x: parseFloat(a.x2.value),
                y: parseFloat(a.y2.value)
              }
            });
        }
      }
      return path;
    };
    parseTrack = function(track) {
      var a, node, path, _i, _len, _ref;
      path = [];
      _ref = track.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.nodeType !== 1) {
          continue;
        }
        a = node.attributes;
        if (!a) {
          continue;
        }
        switch (node.nodeName) {
          case "MoveTo":
            path.push({
              x: parseFloat(a.x.value),
              y: parseFloat(a.y.value),
              size: a.size ? parseFloat(a.size.value) : config.trackWidth
            });
        }
      }
      return path;
    };
    createWordAndView = function(element, val) {
      var $canvas, canvas, ctx, word;
      $canvas = $("<canvas></canvas>");
      $canvas.css("width", config.dim * config.scale * config.styleScale + "px");
      $canvas.css("height", config.dim * config.scale * config.styleScale + "px");
      $(element).append($canvas);
      canvas = $canvas.get()[0];
      canvas.width = config.dim * config.scale;
      canvas.height = config.dim * config.scale;
      ctx = canvas.getContext("2d");
      word = new Word(val);
      fetchStrokeXml(word.utf8code, function(doc) {
        var index, outline, tracks, _i, _len, _ref, _results;
        tracks = doc.getElementsByTagName("Track");
        _ref = doc.getElementsByTagName('Outline');
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          outline = _ref[index];
          _results.push(word.strokes.push({
            outline: parseOutline(outline),
            track: parseTrack(tracks[index])
          }));
        }
        return _results;
      });
      return {
        drawBackground: function() {
          return word.drawBackground(ctx);
        },
        draw: function() {
          return word.draw(ctx);
        }
      };
    };
    createWordsAndViews = function(element, words) {
      return Array.prototype.map.call(words, function(word) {
        return createWordAndView(element, word);
      });
    };
    window.WordStroker || (window.WordStroker = {});
    return window.WordStroker.canvas = {
      Word: Word,
      createWordsAndViews: createWordsAndViews
    };
  });

}).call(this);

/*
//@ sourceMappingURL=draw.canvas.js.map
*/