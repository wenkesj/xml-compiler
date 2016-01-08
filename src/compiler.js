var fs = require('fs');
var Path = require('path');
var jxon = require('jxon');
var Builder = require('./builder');
var _charSet = 'utf-8';
var _jsExt = '.js';
var _xmlExt = '.xml';

/**
* Compiles the xml to javascript flavors.
* @arg { Object } options, { jsOut, ... }
* @arg { Object } jxonConfig, https://www.npmjs.com/package/jxon
*/
function XMLCompiler (jxonConfig) {
  this.buildLine = [];
  if (jxonConfig) {
    jxon.config(jxonConfig);
  }
}

XMLCompiler.prototype = {
  /**
  * Converts the XML doc to JSON.
  * @arg {Object} docs
  * @param { Array } docs.docPaths
  * @param { Array } docs.depPaths
  * @param { Boolean } docs.jsOut
  */
  toJSON: function(docs) {
    var self = this;
    var docPaths = docs.docPaths ? docs.docPaths : [];
    var depPaths = docs.depPaths ? docs.depPaths : [];
    var jsOut = docs.jsOut ? docs.jsOut : false;
    var dest = docs.destDir ? docs.destDir : '';
    return new Promise(function(resolve, reject) {
      self.create(dest, _jsExt, jsOut, docPaths, depPaths)
      .then(function(res) {
        resolve(self.buildLine);
      }).catch(function(err) {
        return reject(err);
      });
    });
  },

  /**
  * Converts the JSON doc to XML.
  * @arg {Object} docs
  * @param { Array } docs.docPaths
  */
  toXML: function(docs) {
    var self = this;
    var docPaths = docs.docPaths ? docs.docPaths : [];
    var depPaths = docs.depPaths ? docs.depPaths : [];
    return new Promise(function(resolve, reject) {
      self.create(_xmlExt, false, docPaths, depPaths)
      .then(function(res) {
        resolve(self.buildLine);
      }).catch(function(err) {
        return reject(err);
      });
    });
  },

  /**
  * Creates a new javascript file.
  * @arg { Array } docPaths
  * @arg { Array } depPaths
  */
  create: function(dest, ext, jsOut, docPaths, depPaths) {
    var self = this;
    return new Promise(function(resolve, reject) {
      docPaths.forEach(function(docPath, index) {
        var file = Path.join(__dirname, docPath);
        var doc = Path.parse(file);
        var source = doc.name + ext;
        var data = '/** ' + doc.name + ext + 'generated file */\n';
        if (!jsOut) {
          return self.promoteRead(dest, ext, jsOut, docPath, docPaths, source)
          .then(function(res) {
            resolve(res);
          }).catch(function(err) {
            return reject(err);
          });
        }
        fs.writeFile(source, data, function(err) {
          if (err) {
            return reject(err);
          }
          if (depPaths[0]) {
            self.readDependencies(depPaths, source)
            .catch(function(err) {
              return reject(err);
            });
          }
          self.promoteRead(ext, jsOut, docPath, docPaths, source)
          .then(function(res) {
            resolve(res);
          }).catch(function(err) {
            return reject(err);
          });
        });
      });
    });
  },

  /**
  * Performs the read and build process.
  * @arg {Object} docs
  * @param { Array } docs.docPaths
  * @param { Array } docs.depPaths
  */
  promoteRead: function(dest, ext, jsOut, docPath, docPaths, source) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.read(ext, docPath)
      .then(function(build) {
        self.buildLine.push(build);
        self.build(dest, build, source, ext, jsOut)
        .then(function(res) {
          console.info('File added ', Path.parse(source).name + (ext === '.js' ? '.json' : '.xml'));
          return resolve(res);
        }).catch(function(err) {
          return reject(err);
        });
      }).catch(function(err) {
        return reject(err);
      });
    });
  },

  /**
  * Reads the dependencies from source and appends them.
  * @arg { Array } depPaths
  */
  readDependencies: function(depPaths, source) {
    return new Promise(function(resolve, reject) {
      depPaths.forEach(function(path) {
        var doc = Path.parse(path);
        var data = 'var ' + doc.name + ' = ' + 'require(\'' + path + '\');\n';
        fs.appendFile(source, data, function(err) {
          if (err) {
            return reject(err);
          }
        });
      });
      resolve();
    });
  },

  /**
  * Iterates over the buildQueue to find special keys.
  * @arg { Object } doc
  * @arg { String } source
  */
  build: function(dest, doc, source, ext, jsOut) {
    var self = this;
    return new Promise(function(resolve, reject) {
      var _builder = new Builder();
      _builder.construct(dest, doc, source, ext, jsOut)
      .then(function(result) {
        resolve(result);
      }).catch(function(err) {
        return reject(err);
      });
    });
  },

  /**
  * Reads a file and turns it into JSON trees.
  * Populates the buildQueue.
  * @arg { String } docPath
  */
  read: function(ext, docPath) {
    return new Promise(function(resolve, reject) {
      fs.readFile(docPath, _charSet, function(err, data) {
        if (err) {
          return reject(err);
        }
        if (ext === '.xml') {
          var json = JSON.parse(data);
          return resolve(jxon.unbuild(json));
        }
        var xml = jxon.stringToXml(data);
        resolve(jxon.build(xml));
      });
    });
  }
};

module.exports = XMLCompiler;
