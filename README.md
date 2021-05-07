# babel-plugin-content-transformer
Easily transform YAML, TOML, and Markdown into normal JavaScript objects and
convert directories of content into arrays at build time.

## Install
`npm i -D babel-plugin-content-transformer`
## Usage
### Transform a directory of Markdown files into an array of strings
```javascript
['content-transformer', {
  transformers: [
    // Convert import statements ending with ".md" into strings
    {
      file: /\.md$/,
      format: 'string'
    }
  ],
  content: [
    // Import statements ending with "content" are converted into
    // an array of imports. The array will ony include ".md" files
    {
      dir: /content$/,
      filter: /\.md$/
    }
  ]
}]
```
### Load YAML files as objects
Requires [yaml] to be installed.
```javascript
// Matches ".yaml" and ".yml" imports and converts them to JS objects
['content-transformer', {
  transformers: [{
    file: /\.ya?ml$/,
    format: 'yaml'
  }]
}]
```

### Load TOML files as objects
Requires [toml] to be installed.
```javascript
['content-transformer', {
  transformers: [{
    file: /\.toml/,
    format: 'toml'
  }]
}]
```

### Custom transformation
This custom transformer will extract [frontmatter] from Markdown files and
transform it into an object with the Markdown content in a "body" property.

```javascript
// babel.config.js
const parse = require('remark-parse')
const stringify = require('remark-stringify')
const frontmatter = require('remark-frontmatter')
const extract = require('remark-extract-frontmatter')
const yaml = require('yaml')

module.exports = {
  plugins: [
    ['content-transformer', {
      transformers: [{
        file: /\.md$/,
        transform (contents, filename) {
          const file = unified()
            .use(parse)
            .use(stringify)
            .use(frontmatter)
            .use(extract, { yaml: yaml.parse })
            .processSync(contents)
          const data = { ...file.data }
          if (file.toString()) {
            data.body = file.toString()
          }
          return data
        }
      }]
    }]
  ]
}
```

## Configuration

### Transformers
All transformers need to have at minimum a "file" definition. This indicates which files should be transformed. Either a "transform" or "format" block can be provided, but not both. If both are omitted, the file is loaded as a string.

| Name        | Type | Description | Required | Default |
| ----------- | ---- | ----------- | -------- | ------- |
| file        | RegExp | Which files to transform. An object with a "test" method like a RegExp. | true | |
| transform   | `(contents: string, filename: string) => any` | A custom transformation function. | false    | |
| format      | string | One of 'yaml', 'toml', 'string' | false | `'string'` |


### Content
Content blocks transform directories into arrays for easy consumption. Can be used together with transformers for easy content loading.

| Name        | Type | Description               | Required | Default |
| ----------- | ---- | -----------               | -------- | ------- |
| dir | RegExp | Indicates which import statements should be treated as content directories. | true | |
| filter | RegExp | Filters out files within matching directories | false | null



[yaml]: https://www.npmjs.com/package/yaml
[toml]: https://www.npmjs.com/package/toml
[frontmatter]: https://github.com/remarkjs/remark-frontmatter