/* jshint esnext: true */
import fs from 'fs';
import Path from 'path';
import jxon from 'jxon';
import Builder from './builder';

const charSet = 'utf-8';
const _jsExt = '.js';
const _xmlExt = '.xml';

/**
 * Compiles the xml to javascript flavors.
 * @arg { Object } options, { jsOut, ... }
 * @arg { Object } jxonConfig, https://www.npmjs.com/package/jxon
 */
export default class XMLCompiler {
    constructor(jxonConfig) {
        this.buildLine = [];
        if (jxonConfig) {
            jxon.config(jxonConfig);
        }
    }

    /**
     * Converts the XML doc to JSON.
     * @arg {Object} docs
     * @param { Array } docs.docPaths
     * @param { Array } docs.depPaths
     * @param { Boolean } docs.jsOut
     */
    toJSON(docs) {
        let docPaths = docs.docPaths ? docs.docPaths : [];
        let depPaths = docs.depPaths ? docs.depPaths : [];
        let jsOut = docs.jsOut ? docs.jsOut : false;
        /** Create the promise chain. */
        return new Promise((resolve, reject) => {

            /** Create the files. */
            this.create(_jsExt, jsOut, docPaths, depPaths).then(() => {
                resolve(this.buildLine);
            }).catch((err) => {
                if (err) {
                    return reject(err);
                }
            });
        });
    }

    /**
     * Converts the JSON doc to XML.
     * @arg {Object} docs
     * @param { Array } docs.docPaths
     */
    toXML(docs) {
        let docPaths = docs.docPaths ? docs.docPaths : [];
        let depPaths = docs.depPaths ? docs.depPaths : [];

        /** Create the promise chain. */
        return new Promise((resolve, reject) => {

            /** Create the files. */
            this.create(_xmlExt, false, docPaths, depPaths).then(() => {
                resolve(this.buildLine);
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
    create(ext, jsOut, docPaths, depPaths) {
        return new Promise((resolve, reject) => {
            docPaths.forEach((docPath, index) => {
                let file = Path.join(__dirname, docPath);
                let doc = Path.parse(file);
                let source = `../${doc.name}${ext}`;
                let data = `/** ${doc.name}${ext} generated file */\n`;

                if (!jsOut) {
                    return this.promoteRead(ext, jsOut, docPath, docPath, source).then(() => {
                        resolve();
                    }).catch((err) => {
                        if (err) {
                            return reject();
                        }
                    });
                }

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
                    this.promoteRead(ext, jsOut, docPath, docPaths, source).then(() => {
                        resolve();
                    }).catch((err) => {
                        if (err) {
                            return reject();
                        }
                    });
                });
            });
        });
    }

    /**
     * Performs the read and build process.
     * @arg {Object} docs
     * @param { Array } docs.docPaths
     * @param { Array } docs.depPaths
     */
    promoteRead(ext, jsOut, docPath, docPaths, source) {
        return new Promise((resolve, reject) => {
            this.read(ext, docPath).then((build) => {
                this.buildLine.push(build);
                this.build(build, source, ext, jsOut).then((res) => {
                    if (index === docPaths.length - 1) {
                        return resolve();
                    }
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
    build(doc, source, ext, jsOut) {
        return new Promise((resolve, reject) => {
            /* Assign a builder to handle the construction. */
            let _builder = new Builder();
            _builder.construct(doc, source, ext, jsOut).then((result) => {
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
    read(ext, docPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(docPath, charSet, (err, data) => {
                if (err) {
                    return reject(err);
                }
                if (ext === '.xml') {
                    let json = JSON.parse(data);
                    return resolve(jxon.unbuild(json));
                }
                let xml = jxon.stringToXml(data);
                resolve(jxon.build(xml));
            });
        });
    }
}
