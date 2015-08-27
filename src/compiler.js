/* jshint esnext: true */
import fs from 'fs';
import Path from 'path';
import jxon from 'jxon';
import Builder from './builder';

const charSet = 'utf-8';
const jsExt = '.js';

/**
 * Compiles the xml to javascript flavors.
 * @arg {Array} docPaths
 * @arg {Array} depPaths
 */
export default class XMLCompiler {
    constructor() {
        this.buildQueue = [];
    }

    /**
     * Runs the compiler.
     * @arg {Object} docs
     * @param { Array } docs.docPaths
     * @param { Array } docs.depPaths
     */
    toJSON(docs) {
        let docPaths = docs.docPaths ? docs.docPaths : [];
        let depPaths = docs.depPaths ? docs.depPaths : [];
        /** Create the promise chain. */
        return new Promise((resolve, reject) => {

            /** Create the files. */
            this.create(docPaths, depPaths).then(() => {

            }).catch((err) => {
                if (err) {
                    return reject(err);
                }
            });
        });
    }

    /**
     * Creates a new javascript file.
     * @arg { Array } docPaths
     * @arg { Array } depPaths
     */
    create(docPaths, depPaths) {
        return new Promise((resolve, reject) => {
            docPaths.forEach((docPath) => {
                let file = Path.join(__dirname, docPath);
                let doc = Path.parse(file);
                let source = `../${doc.name}${jsExt}`;
                let data = `/** ${doc.name}${jsExt} generated file */\n`;
                fs.writeFile(source, data, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    /** Read the dependency files. */
                    if (depPaths[0]) {
                        this.readDependencies(depPaths, source).then(() => {

                        }).catch((err) => {
                            if (err) {
                                return reject(err);
                            }
                        });
                    }

                    /** Read and build the files. */
                    this.read(docPath).then((build) => {

                        this.build(build, source).then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            if (err) {
                                return reject(err);
                            }
                        });
                    }).catch((err) => {
                        if (err) {
                            return reject(err);
                        }
                    });

                });
            });
        });
    }

    /**
     * Reads the dependencies from source and appends them.
     * @arg { Array } depPaths
     */
    readDependencies(depPaths, source) {
        return new Promise((resolve, reject) => {
            depPaths.forEach((path) => {
                let doc = Path.parse(path);
                let data = `import ${doc.name} from '${path}';\n`;
                fs.appendFile(source, data, function(err) {
                    if (err) {
                        return reject(err);
                    }
                });
            });
            resolve();
        });
    }

    /**
     * Iterates over the buildQueue to find special keys.
     * @arg { Object } doc
     * @arg { String } source
     */
    build(doc, source) {
        return new Promise((resolve, reject) => {
            /* Assign a builder to handle the construction. */
            let _builder = new Builder(doc, source);
            _builder.construct().then((result) => {
                resolve(result);
            }).catch((err) => {
                if (err) {
                    return reject(err);
                }
            });
        });
    }

    /**
     * Reads a file and turns it into JSON trees.
     * Populates the buildQueue.
     * @arg { String } docPath
     */
    read(docPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(docPath, charSet, (err, data) => {
                if (err) {
                    return reject(err);
                }
                let xml = jxon.stringToXml(data);
                resolve(jxon.build(xml));
            });
        });
    }
}
