/* jshint esnext: true */
import fs from 'fs';
import Path from 'path';
import jxon from 'jxon';
import Builder from './builder';

let source;
const charSet = 'utf-8';
const jsExt = '.js';

/**
 * Compiles the xml to javascript flavors.
 * @arg {Array} docPaths
 * @arg {Array} depPaths
 */
export default class XMLCompiler {
    constructor(docPaths, depPaths) {
        this.docPaths = docPaths;
        this.depPaths = depPaths ? depPaths : [];
        this.buildQueue = [];
    }

    /**
     * Runs the compiler.
     * @arg {Array} docPaths
     * @arg {Array} depPaths
     */
    toJSON() {
        /** Create the promise chain. */
        return new Promise((resolve, reject) => {

            /** Create the files. */
            this.create().then(() => {

                /** Read the dependencies. */
                this.readDependencies().then(() => {

                    /** Read the files. */
                    this.read().then(() => {

                        /** Builds the files. */
                        this.build().then((res) => {

                            /** Finish. */
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
    }

    /**
     * Creates a new javascript file.
     * @arg {Function} callback
     */
    create(callback) {
        return new Promise((resolve, reject) => {
            this.docPaths.forEach((docPath) => {
                let file = Path.join(__dirname, docPath);
                let doc = Path.parse(file);
                    source = `../${doc.name}${jsExt}`;
                let data = `/** ${doc.name}${jsExt} generated file */\n`;
                fs.writeFile(source, data, function(err) {
                    if (err) {
                        return reject(err);
                    }
                });
            });
            resolve();
        });
    }

    /**
     * Reads the dependencies from source and appends them.
     * @arg {Array} paths
     * @arg {Function} callback
     */
    readDependencies() {
        return new Promise((resolve, reject) => {
            this.depPaths.forEach((path) => {
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
     */
    build() {
        return new Promise((resolve, reject) => {
            /* Assign a builder to handle the construction. */
            let _builder = new Builder(this.buildQueue, source);
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
     */
    read() {
        return new Promise((resolve, reject) => {
            this.docPaths.forEach((docPath) => {
                let xml = jxon.stringToXml(fs.readFileSync(docPath, charSet));
                this.buildQueue.push(jxon.build(xml));
            });
            resolve();
        });
    }
}
