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
/** Import the compiler */
import XMLCompiler from '../src/compiler';

/**
 * Set the path for the files to compile,
 * Set the path for the dependencies to be imported to the file.
 */
let docs = [
    {
        docPaths: ['test.xml', 'test2.xml'],
        depPaths: ['./builder.js']
    }
];

/** Initialize the compiler. */
let xmlCompiler = new XMLCompiler();

/** Invoke the toJSON promise. */
docs.forEach(function(doc) {
    xmlCompiler.toJSON(doc).then(() => {
        console.log('Finished Compiling!');
    }).catch((err) => {
        if (err) {
            console.log('Oops something went wrong with this one!');
        }
    });
});

```
## API ##
### `new XMLCompiler(docPaths, depPaths)` ###
+ `docPaths` { Array } of xml files
+ `[Optional] depPaths` { Array }

### `XMLCompiler.toJSON()` ###
+ Returns a Promise and outputs the JSON file into the parent directory.
