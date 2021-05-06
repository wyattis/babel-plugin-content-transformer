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
            if (!t.file) {
              throw UnsupportedError
            }
            if (p.node && p.node.source && t.file.test(p.node.source.value)) {
              loadFile(types, p, state, t)
              break
            }
          }
        } 
        if (opts.content) {
          for (const c of opts.content) {
            if (!c.dir) {
              throw UnsupportedError
            }
            if (p.node && p.node.source && c.dir.test(p.node.source.value)) {
              loadDirectory(types, p, state, c)
              break
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