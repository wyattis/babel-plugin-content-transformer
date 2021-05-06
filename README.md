# babel-plugin-content-transformer
Easily transform YAML, TOML, and Markdown as normal JavaScript objects at build time. Also transform directories of content into simple arrays for consumption.

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
transform it into an object adding a "body" property for the Markdown content.

```javascript
const parse = require('remark-parse')
const stringify = require('remark-stringify')
const frontmatter = require('remark-frontmatter')
const extract = require('remark-extract-frontmatter')
const yaml = require('yaml')

// In plugins sections of babel.config.js
['content-transformer', {
  transformers: [{
    file: /\.md$/,
    transform (contents) {
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
```

[yaml]: https://www.npmjs.com/package/yaml
[toml]: https://www.npmjs.com/package/toml
[frontmatter]: https://github.com/remarkjs/remark-frontmatter