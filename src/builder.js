/* jshint esnext: true */
import fs from 'fs';
import Path from 'path';
import format from 'format-json';

const jsonExt = '.json';
export default class Builder {
    constructor(build, source) {
        this.build = build;
        this.destination = source;
        this.classList = [];
        this.attributeList = [];
        this.keyValueList = [];
    }

    construct(build, source) {
        return new Promise((resolve, reject) => {
            this.outputJSON(this.build).then((source) => {
                this.importJSON(source).then((res) => {
                    resolve(format.plain(build));
                }).catch((err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
            }).catch((err) => {
                if (err) {
                    return console.error(err);
                }
            });
            resolve(this.classList);
        });
    }

    importJSON(source) {
        return new Promise((resolve, reject) => {
            const name = Path.parse(this.destination).name;
            let data = `import ${name} from './${name}${jsonExt}';\n`;
            fs.appendFile(this.destination, data, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    outputJSON(build) {
        return new Promise((resolve, reject) => {
            let doc = Path.parse(this.destination),
                source = `../${doc.name}${jsonExt}`,
                json = format.plain(build);
            fs.writeFileSync(source, json);
            resolve(source);
        });
    }
}
