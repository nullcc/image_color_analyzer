/**
  计算canvas中图片的颜色数
  注意：本程序会忽略掉所有半透明的像素颜色
**/

var canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext("2d"),
    w = canvas.width,
    h = canvas.height;

var areaFactor = 100 * 5000.0; // 面积因子
var scaleFactor = 1; // 缩放因子
ctx.scale(scaleFactor, scaleFactor); // 缩放canvas

var imgNames = [
  "https://img5.doubanio.com/icon/ul83748698-6.jpg",
  "./images/redux.png",
  "./images/nodejs.png",
  "./images/react.png",
  "./images/nightwatchjs.png",
  "./images/nyan.jpg",
  "./images/saketocat.jpg",
  "./images/android.jpg",
  "./images/city.jpg"
];
var imgs = [];

for (var i = 0; i < imgNames.length; i++) {
  var img = new Image();
  img.src = imgNames[i];
  imgs.push(img);
}

// 统计颜色
function handle(img) {
  console.log('size: ' + img.width + 'x' + img.height);
  var idata = ctx.getImageData(0, 0, img.width, img.height),
      buffer32 = new Uint32Array(idata.data.buffer),
      i, len = buffer32.length,
      states = {};
  for (i = 0; i < len; i++) {
    var key = "" + (buffer32[i] & 0xffffffff); // 不能过滤透明部分，否则透明部分会算到黑色上面
    if (!states[key]) states[key] = 0;
    states[key]++;
  }

  var imgSize = img.width * img.height * scaleFactor;
  var newStates = {};
  for (var key in states) {
    if (states[key] > imgSize / areaFactor) {
      newStates[key] = states[key];
    }
  }

  var colors = [];
  for (var key in newStates) {
    var color = getRGBA(key);
    if (color.a === 255) {
      colors.push({
        key: key,
        color: getRGBA(key),
        count: newStates[key]
      });
    }
  }

  var _colors = aggregateColor(colors);

  var resultColors = [];
  for (var i = 0; i < _colors.length; i++) {
    var color = _colors[i].color;
    var count = _colors[i].count;
    var colorHex = colorRGB2Hex(color.r, color.g, color.b);
    resultColors.push({
      r: color.r,
      g: color.g,
      b: color.b,
      a: color.a,
      colorHex: colorHex,
      count: count,
      percent: (count/imgSize*100.0).toFixed(4)
    });
  }
  resultColors.sort(sortColor);
  showResult(resultColors);
}

// 显示颜色分析结果
function showResult(colors) {
  var result = document.getElementById('result');
  var resultHtmls =
  "<table class='table' border='1' cellspacing='5' cellpadding='5'>"
    + "<tr>"
      + "<th>颜色</th>"
      + "<th>hex</th>"
      + "<th>占比(%)</th>"
    + "</tr>";

  colors.forEach(function(color){
    var html =
      "<tr>"
      +  "<td>" + "<div class='color' style='" + "background-color:" + color.colorHex +  "'>" + "</div>" + "</td>"
      +  "<td>" + "<span class='colorHex'>" + color.colorHex + "</span>" + "</td>"
      +  "<td>" + color.percent + "%" + "</td>"
      + "</tr>"
    resultHtmls += html;
  });
  resultHtmls += "</table>"
  result.innerHTML = resultHtmls;
}

// 颜色排序函数
function sortColor(a, b) {
  return b.percent - a.percent;
}

// 选择图片并展示
function selectImage(index) {
  ctx.clearRect(0, 0, w, h);
  var img = imgs[index];
  if (img) {
    // if (img.width > w || img.height > h) {
    //   scaleFactor = 0.5;
    // } else {
    //   scaleFactor = 1;
    // }
    // ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(img, 0, 0);
    handle(img);
  }
}

// 显示图片按钮
function showImgBtn(imgs) {
  var html = "";
  for (var i = 0; i < imgs.length; i++) {
    html += "<button class=\"img_btn\" onclick=\"selectImage(" + i + ")\">图片" + i + "</button>"
  }
  document.getElementById("buttons").innerHTML = html;
}

showImgBtn(imgs);
