import Plugin from '../src'
import * as babel from '@babel/core'
import { expect } from 'chai'
import { evalTransformed } from './evalTransformed'


describe('Directory', () => {
  it('loads a directory as an array', () => {
    const t = babel.transform(
      `import vals from './content/posts'`,
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