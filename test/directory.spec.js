import Plugin from '../src'
import * as fs from 'fs'
import * as path from 'path'
import * as babel from '@babel/core'
import { expect } from 'chai'
import { evalTransformed } from './evalTransformed'


describe('Directory', () => {
  it('loads a directory as an array', () => {
    const t = babel.transform(
      `import vals from './content/posts'
        export default vals`,
      {
        filename: __filename,
        plugins: [
          [Plugin, {
            content: [{
              dir: /posts$/,
              filter: /\.js$/
            }]
          }]
        ]
      }
    )

    expect(evalTransformed(t)).to.deep.equal([{ default: 1 }, { default: 2 }])
  })

  it('loads directory and transforms files', () => {
    const t = babel.transform(
      `import vals from './content/posts'
      export default vals`,
      {
        filename: __filename,
        plugins: [
          [Plugin, {
            content: [{
              dir: { test: p => p.endsWith('posts') },
              filter: { test: p => p.endsWith('.md') }
            }],
            transformers: [{
              file: { test: p => p.endsWith('.md') },
              format: 'string'
            }]
          }]
        ]
      }
    )

    expect(evalTransformed(t)).to.deep.equal([
      fs.readFileSync(path.join(__dirname, './content/posts/one.md'), 'utf-8'),
      fs.readFileSync(path.join(__dirname, './content/posts/two.md'), 'utf-8')
    ])
  })

})