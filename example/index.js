var XMLCompiler = require('../index');
var xmlCompiler = new XMLCompiler();

var xmlQueue = [{
  docPaths: ['example/test.xml', 'example/test2.xml', 'example/test3.xml'],
  destDir: 'example',
  jsOut: false
}];

xmlQueue.forEach(function(doc) {
  xmlCompiler.toJSON(doc)
  .then(function(res) {
    console.log('√ Successful compilation');
  }).catch(function(err) {
    console.log('X Oops something went wrong with this one!', err);
  });
});
