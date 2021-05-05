# babel-content-loader
Load yaml, toml, csv, and markdown as normal JavaScript objects. Load
directories of content as an array.

## Simple config options
```javascript
{
  ...
  // Match yaml extensions and convert to JS objects
  ['babel-content-loader', {
    file: /\.ya?ml$/,
    format: 'yaml'
  }],
  // Match markdown extensions and load as a string
  ['babel-content-loader', {
    file: /\.md$/,
    format: 'string'
  }],
  // Match toml extensions and convert to JS objects
  ['babel-content-loader', {
    file: /\.toml$/,
    format: 'toml'
  }],
  // Match frontmatter extensions and convert to JS objects
  ['babel-content-loader', {
    file: /\.md$/,
    format: 'frontmatter',
    options: {}
  }],
  ...
}
```