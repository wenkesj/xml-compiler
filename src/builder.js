var fs = require('fs');
var Path = require('path');
var jsonFormat = require('format-json');
var formattor = require("formattor");
var _jsonExt = '.json';

function Builder() {
  this.classList = [];
  this.attributeList = [];
  this.keyValueList = [];
}

Builder.prototype = {
  construct: function(dest, build, source, ext, jsOut) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.output(dest, build, source, ext).then(function() {
        if (!jsOut) {
          return resolve(build);
        }
        self.import(source).then(function(res) {
          return resolve(build);
        }).catch(function(err) {
          throw new Error(err);
        });
      }).catch(function(err) {
          throw new Error(err);
      });
    });
  },

  import: function(source) {
    return new Promise(function(resolve, reject) {
      var name = Path.parse(source).name;
      var data = 'var ' + name + ' = ' + 'require(\'./' + name + _jsonExt + '\');\n';
      fs.appendFile(source, data, function(err) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  },

  output: function(dest, build, source, ext) {
    if (ext === '.js') {
      ext = _jsonExt;
    }
    return new Promise(function(resolve, reject) {
      var doc = Path.parse(source),
      newSource = dest + (dest[dest.length - 1] === '/' ? '' : '/' ) + doc.name + ext;
      var out = build;
      if (ext === '.json') {
        out = jsonFormat.plain(build);
      }
      if (ext === '.xml') {
        build = build.toString();
        out = formattor(build, {
          method: 'xml'
        });
      }
      console.log(newSource);
      fs.writeFileSync(newSource, out);
      resolve(newSource);
    });
  }
};

module.exports = Builder;
