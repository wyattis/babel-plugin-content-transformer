import { loadFile } from './loadFile'
import { loadDirectory } from './loadDirectory'

export default function ContentPlugin ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration (p, state) {
        const opts = state.opts
        if (opts.file) {
          loadFile(t, p, state, opts)
        } else if (opts.dir) {
          loadDirectory(t, p, state, opts)
        } else {
          throw new Error('Unsupported configuration for babel-content-plugin')
        }
      }
    }
  }
}