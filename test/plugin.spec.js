import Plugin from '../src'
import * as babel from '@babel/core'
import fs from 'fs'
import path from 'path'
import { expect } from 'chai'

function evalTransformed (transformed) {
  return eval(`
    (function () {
      ${transformed.code};
      return exports.default;
    })()
  `)
}

describe('loading', () => {

  it('loads markdown as a string', () => {
    const t = babel.transform(
      `import content from '../content/markdown.md'
        export default content`,
      {
        filename: __filename,
        plugins: [
          [Plugin, {
            file: /\.md$/,
            format: 'string'
          }]
        ]
      }
    )
    
    expect(evalTransformed(t)).to.equal(fs.readFileSync(path.join(__dirname, '../content/markdown.md'), 'utf-8'))
  })

  it('loads yaml as an object', () => {
    const t = babel.transform(
      `import config from '../content/yaml.yaml';
      export default config`,
      {
        filename: __filename,
        plugins: [
          [Plugin, {
            file: /\.ya?ml$/,
            format: 'yaml'
          }]
        ]
      }
    )

    expect(evalTransformed(t)).to.deep.equal({ hello: 'world' })
  })

  it('loads toml as an object', () => {
    const t = babel.transform(
      `import config from '../content/toml.toml';
      export default config`,
      {
        filename: __filename,
        plugins: [
          [Plugin, {
            file: /\.to?ml$/,
            format: 'toml'
          }]
        ]
      }
    )

    expect(evalTransformed(t)).to.deep.equal({ hello: 'world' })
  })

  it('loads a directory as an array', () => {
    const t = babel.transform(
      `import vals from '../content/posts'`,
      {
        filename: __filename,
        plugins: [
          [Plugin, {
            dir: /posts$/,
            filter: /\.js$/
          }]
        ]
      }
    )

    expect(evalTransformed(t)).to.deep.equal([{ default: 1 }, { default: 2 }])
  })
})