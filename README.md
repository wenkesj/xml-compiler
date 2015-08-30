# xml-compiler
[ES6ified, Promisified] XML to JSON Compiler based on JXON https://developer.mozilla.org/en-US/docs/JXON
```bash
npm install xml-compiler --save
```
### Note worth looking at ###
This is made from mostly pure ES6, I advise using `babel-node` when developing
## Requiring ##
```js
import XMLCompiler from 'xml-compiler';
```

## Example ##
```js
/* jshint esnext: true */

/** Import the compiler */
import XMLCompiler from 'xml-compiler';

/**
 * Set the path for the files to compile,
 * Set the path for the dependencies to be imported to the file.
 */
let xmlDocs = [
    {
        docPaths: ['test.xml', 'test2.xml'],
        // depPaths: ['dependency.js'],
        /* Optional reference to outputting JS files that require the JSON/dependencies */
        jsOut: false
    }
];

/**
 * Set the path for the files to compile,
 */
let jsonDocs = [
    {
        docPaths: ['test.json', 'test2.json']
    }
];

/** Initialize the compiler. */
let xmlCompiler = new XMLCompiler();

/** Invoke the toJSON promise. */
xmlDocs.forEach(function(doc) {
    xmlCompiler.toJSON(doc).then((res) => {
        console.log('Finished Compiling!', res);
    }).catch((err) => {
        if (err) {
            console.log('Oops something went wrong with this one!');
        }
    });
});

/** Invoke the toXML promise. */
jsonDocs.forEach(function(doc) {
    xmlCompiler.toXML(doc).then((res) => {
        console.log('Finished Compiling!', res);
    }).catch((err) => {
        if (err) {
            console.log('Oops something went wrong with this one!');
        }
    });
```
## API ##
### `new XMLCompiler(config)` ###
+ `config { Object }` https://www.npmjs.com/package/jxon [optional]

### `XMLCompiler.toJSON(doc)` ###
+ `doc` { Object } with params:
    + `docPaths` { Array } of xml files
    + `depPaths` { Array } of js files [optional]
+ Returns a Promise and outputs the JSON file into the parent directory.
