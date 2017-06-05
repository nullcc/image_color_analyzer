var MAX_DELTA_R = 40;
var MAX_DELTA_G = 40;
var MAX_DELTA_B = 40;

// get RGBA
function getRGBA(number) {
  var r = number & 0xff, g = (number & 0xff00) >>> 8, b = (number & 0xff0000) >>> 16, a = (number & 0xff000000) >>> 24;
  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
}

// convert rgb of color to hex
function colorRGB2Hex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// calculate similarity degree of two colors(ignore alpha channel)
function colorSimilarity(color1, color2) {
  var rDelta = Math.abs(color1.r - color2.r);
  var gDelta = Math.abs(color1.g - color2.g);
  var bDelta = Math.abs(color1.b - color2.b);

  if (rDelta >= MAX_DELTA_R || gDelta >= MAX_DELTA_G || bDelta >= MAX_DELTA_B) {
    return false;
  } else if (rDelta + gDelta + bDelta <= 60) {
    return true;
  }
  return false;
}

// 聚合颜色
function aggregateColor(colors){
  var _colors = [];
  for (var i = 0; i < colors.length; i++) {
    var color = colors[i].color;
    if (_colors.length === 0) {
      _colors.push(colors[i]);
      continue;
    }
    for (var j = 0; j < _colors.length; j++) {
      var _color = _colors[j].color;
      var similar = colorSimilarity(color, _color);
      if (!similar && j === _colors.length - 1) {
        _colors.push(colors[i]);
        break;
      } else if (similar) {
        if (colors[i].count > _colors[j].count) {
          _colors[j] = colors[i];
        }
        break;
      }
    }
  }
  return _colors;
}
