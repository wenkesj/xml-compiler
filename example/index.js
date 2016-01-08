var build = require('./build');
var xmlQueue = [{
  docPaths: ['example/test0.xml', 'example/test1.xml'],
  destDir: 'example/build/v1'
},
{
  docPaths: ['example/test2.xml', 'example/test3.xml'],
  destDir: 'example/build/v2'
}];

build(xmlQueue);
