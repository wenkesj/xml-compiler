/* jshint esnext: true */
import fs from 'fs';
import Path from 'path';
import jsonFormat from 'format-json';
import formattor from "formattor";

const _jsonExt = '.json';

export default class Builder {
    constructor() {
        this.classList = [];
        this.attributeList = [];
        this.keyValueList = [];
    }

    construct(build, source, ext, jsOut) {
        return new Promise((resolve, reject) => {
            this.output(build, source, ext).then(() => {
                if (!jsOut) {
                    return resolve(build);
                }
                this.import(source).then((res) => {
                    return resolve(build);
                }).catch((err) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                });
            }).catch((err) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
            });
        });
    }

    import(source) {
        return new Promise((resolve, reject) => {
            const name = Path.parse(source).name;
            let data = `import ${name} from './${name}${_jsonExt}';\n`;
            fs.appendFile(source, data, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    output(build, source, ext) {
        if (ext === '.js') {
            ext = _jsonExt;
        }
        return new Promise((resolve, reject) => {
            let doc = Path.parse(source),
                newSource = `../${doc.name}${ext}`;
            let out = build;
            if (ext === '.json') {
                out = jsonFormat.plain(build);
            }
            if (ext === '.xml') {
                build = build.toString();
                out = formattor(build, {
                    method: 'xml'
                });
            }
            fs.writeFileSync(newSource, out);
            resolve(newSource);
        });
    }
}
