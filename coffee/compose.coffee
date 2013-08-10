# this code runs in node
WordStroker = require "./js/utils.stroke-words"

process.argv.forEach (path, index) ->
  return if index is 0 or index is 1
  result = []
  rule = require path
  rule.strokes.forEach (source, i) ->
    cp = WordStroker.utils.sortSurrogates source.val
    WordStroker.utils.StrokeData.get(
      cp[0],
      (json) ->
        result = result.concat source.indices.map (val) -> json[val]
        console.log JSON.stringify result, null, "  " if i is rule.strokes.length - 1
      , () ->
        console.log
          msg: "failed to compose character"
          path: path
    )
