/* jshint esnext: true */

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
