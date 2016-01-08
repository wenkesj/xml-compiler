var XMLCompiler = require('../index');
var Worker = require('workmen');
var xmlCompiler = new XMLCompiler();

function allocateWorkers(numberOfWorkers) {
  var workers = [];
  for (var i = 0; i < numberOfWorkers; i++) {
    workers[i] = new Worker();
  }
  return workers;
}

function performWork(doc) {
  xmlCompiler.toJSON(doc)
  .then(function(res) {
    console.log('√ Successful compilation');
  }).catch(function(err) {
    console.log('X Oops something went wrong with this one!', err);
  });
}

function compileDocuments(documents) {
  var workers = allocateWorkers(2);
  workers[0].open(function() {
    performWork(documents[0]);
    this.close();
  });
  workers[1].open(function() {
    performWork(documents[1]);
    this.close();
  });
}

module.exports = compileDocuments;
