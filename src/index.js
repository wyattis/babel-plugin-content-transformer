import { loadFile } from './loadFile'
import { loadDirectory } from './loadDirectory'

const UnsupportedError = new Error('Unsupported configuration for babel-plugin-content-transformer')

export default function ContentPlugin ({ types }) {
  return {
    visitor: {
      ImportDeclaration (p, state) {
        const opts = state.opts
        if (opts.transformers) {
          for (const t of opts.transformers) {
            if (t.file) {
              loadFile(types, p, state, t)
            } else {
              throw UnsupportedError
            }
          }
        } 
        if (opts.content) {
          for (const c of opts.content) {
            if (c.dir) {
              loadDirectory(types, p, state, c)
            } else {
              throw UnsupportedError
            }
          }
        } 
        if (!(opts.transformers || opts.content)){
          throw UnsupportedError
        }
      }
    }
  }
}