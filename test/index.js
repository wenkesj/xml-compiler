/* jshint esnext: true */

/** Import the compiler */
import XMLCompiler from '../src/compiler';

/**
 * Set the path for the files to compile,
 * Set the path for the dependencies to be imported to the file.
 */
let docPaths = ['test.xml'];
let depPaths = ['./builder.js'];

/** Initialize the compiler. */
let xmlCompiler = new XMLCompiler(docPaths, depPaths);

/** Invoke the toJSON promise. */
xmlCompiler.toJSON().then(() => {
    
}).catch((err) => {
    if (err) {
        console.log(err);
    }
});
