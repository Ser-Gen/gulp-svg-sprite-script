var through2 = require('through2');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var SVGO = require('svgo');
var svgo = new SVGO({
  plugins: [{
    mergePaths: false
  }]
});

var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-svg-sprite-script';

var filePath = 'node_modules/'+ PLUGIN_NAME + '/';

function svgSpriteScript (opts) {
  var isEmpty = true
  var fileName
  var inlineSvg = true
  var ids = {}

  var resultSvg = '<svg xmlns="http://www.w3.org/2000/svg" />';

  var $ = cheerio.load(resultSvg, { xmlMode: true })
  var $combinedSvg = $('svg')

  var stream = through2.obj(

    function transform (file, encoding, cb) {

      if (file.isStream()) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'))
      }

      file.path = 'icon-'+ path.basename(file.path);

      svgo.optimize(String(file.contents), function(result) {
        file.contents = new Buffer(result.data);
      });

      if (!file.cheerio) {
        file.cheerio = cheerio.load(file.contents.toString(), { xmlMode: true })
      }

      var $svg = file.cheerio('svg')
      var idAttr = path.basename(file.relative, path.extname(file.relative))
      var viewBoxAttr = $svg.attr('viewBox')
      var $symbol = $('<symbol/>')

      if (idAttr in ids) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'File name should be unique: ' + idAttr))
      }

      ids[idAttr] = true

      if (!fileName) {
        fileName = path.basename(file.base)
        if (fileName === '.' || !fileName) {
          fileName = 'icon.svg'
        } else {
          fileName = fileName.split(path.sep).shift() + '.svg'
        }
      }

      if (file && isEmpty) {
        isEmpty = false
      }

      $symbol.attr('id', idAttr)
      if (viewBoxAttr) {
        $symbol.attr('viewBox', viewBoxAttr)
      }

      $symbol.append($svg.contents())
      $combinedSvg.append($symbol)
      cb()
    },
    function flush (cb) {
      if (isEmpty) return cb();

      var svgContent = $.xml();
      var file = new gutil.File({
        path: fileName,
        contents: new Buffer(svgContent)
      });
      var cheer = cheerio.load(svgContent);

      $('svg').attr({
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'style': 'display: none'
      });
      svgContent = $.html();

      file.path = 'icons.svg';
      file.contents = new Buffer(svgContent);

      fs.readFile(filePath +'icons-tmpl.js', function (err, data)
      {
        if (err) {
          throw err;
        };

        var _this = this;
        var LINE_LENGTH = 60, svg = [], i, l;

        svgContent = svgContent.replace(/'/g, "\\'");
        svgContent = svgContent.replace(/>\s+</g, "><").trim();
        l = Math.ceil(svgContent.length / LINE_LENGTH);

        for (i = 0; i < l; i++)
        {
          svg.push("'" + svgContent.substr(i * LINE_LENGTH, LINE_LENGTH) + "'");
        };

        data = data.toString();
        data = data.replace(/%SVG_SPRITE%/, svg.join('+\n'));

        fs.readFile(filePath +'icons-tmpl.css', function(err, dataStyle)
        {
          if (err) {
            throw err;
          };
          dataStyle = dataStyle.toString();


          var LINE_LENGTH = 60, styles = [], i, l;

          dataStyle = '<style>'+ dataStyle +'</style>';
          dataStyle = dataStyle.replace(/\n/g, "");
          dataStyle = dataStyle.replace(/\s+/g, " ");
          dataStyle = dataStyle.replace(/'/g, "\\'");
          dataStyle = dataStyle.replace(/>\s+</g, "><").trim();
          l = Math.ceil(dataStyle.length / LINE_LENGTH);

          for (i = 0; i < l; i++)
          {
            styles.push("'" + dataStyle.substr(i * LINE_LENGTH, LINE_LENGTH) + "'");
          };

          data = data.replace(/%STYLE%/, styles.join('+\n'));

          stream.push(new gutil.File({
            path: 'icons.js',
            contents: new Buffer(data)
          }));

          file.cheerio = $;
          stream.push(file);
          cb();
        });
      });
    }
  );

  return stream;
};

module.exports = svgSpriteScript;
