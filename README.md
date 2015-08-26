# xml-compiler
[ES6ified, Promisified] XML to JSON Compiler based on JXON https://developer.mozilla.org/en-US/docs/JXON
```bash
npm install xml-compiler --save
```
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
let docPaths = ['test.xml'];
// let depPaths = ['./builder.js'];

/** Initialize the compiler. */
let xmlCompiler = new XMLCompiler(docPaths, depPaths);

/** Invoke the toJSON promise. */
xmlCompiler.toJSON().then(() => {

}).catch((err) => {
    if (err) {
        console.log(err);
    }
});
```
## API ##
### `new XMLCompiler(docPaths, depPaths)` ###
+ `docPaths` { Array } of xml files
+ `[Optional] depPaths` { Array }

### `XMLCompiler.toJSON()` ###
+ Returns a Promise and outputs the JSON file into the parent directory.
