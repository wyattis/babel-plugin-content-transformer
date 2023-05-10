const Plugin = require('../../dist')
module.exports =  {
  targets: {
    node: '7'
  },
  presets: [
    '@babel/preset-env'
  ],
  plugins: [
    [Plugin, {
      source: ['./temp/posts'],
      filter: { test: p => p.endsWith('.md') },
      format: 'string',
      nocache: true,
    }]
  ]
}