# xml-compiler #
XML and JSON Compiler based on the documentation of [JXON](https://developer.mozilla.org/en-US/docs/JXON)

```bash
npm install xml-compiler --save
```
# Try it out #
```bash
node example
```

# API #
## new XMLCompiler(config) ##
Create a new instance of the **XMLCompiler**
+ config - Object based on [JXON](https://www.npmjs.com/package/jxon) [optional]

## XMLCompiler.toJSON(DocObject) ##
Create a new JSON file from an XML file. Returns the corresponding JSON object from the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

**DocObject**

| Property | Type | Description | Required |
| -------- | ---- | ----------- | -------- |
| docPaths | Array (String) | Array of paths to the target files. | Yes |
| destDir | String | Path destination for the compiled files. | No |
| jsOut | Bool | Optional JS file to be added with the source of the JSON file in a require statement. | No |

**For example**
```js
{
  docPaths: ['some/path/to/file.xml'],
  destDir: 'some/output/path'
}
```
