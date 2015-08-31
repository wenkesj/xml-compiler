/* jshint esnext: true */

/** Import the compiler */
import XMLCompiler from '../src/compiler';

/**
 * Set the path for the files to compile,
 * Set the path for the dependencies to be imported to the file.
 */
let xmlDocs = [
    {
        docPaths: ['test.xml', 'test2.xml', 'test3.xml'],
        jsOut: false
    }
];

/**
 * Set the path for the files to compile,
 */
let jsonDocs = [
    {
        docPaths: ['test.json', 'test2.json', 'test3.json']
    }
];

/** Initialize the compiler. */
let xmlCompiler = new XMLCompiler();

/** Invoke the toJSON promise. */
console.time('toJSON');
xmlDocs.forEach(function(doc) {
    xmlCompiler.toJSON(doc).then((res) => {
        console.timeEnd('toJSON');
    }).catch((err) => {
        if (err) {
            console.log('Oops something went wrong with this one!');
        }
    });
});

/** Invoke the toXML promise. */
console.time('toXML');
jsonDocs.forEach(function(doc) {
    xmlCompiler.toXML(doc).then((res) => {
        console.timeEnd('toXML');
    }).catch((err) => {
        if (err) {
            console.log('Oops something went wrong with this one!');
        }
    });
});
