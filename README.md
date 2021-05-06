# babel-plugin-content-transformer
Easily transform YAML, TOML, and Markdown as normal JavaScript objects at build time. Transform directories of content into simple arrays.

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
```javascript
['content-transformer', {
  transformers: [{
    file: /\.md/
    transform (contents) {
      // Transform using remark + unifiedjs
      return eval(contents)
    }
  }]
}]
```

[yaml]: https://www.npmjs.com/package/yaml
[toml]: https://www.npmjs.com/package/toml