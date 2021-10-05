import * as path from 'path'

export function resolvePath (p, sourcePath) {
  if (p.startsWith('.')) {
    const base = path.dirname(sourcePath)
    return path.join(base, p)
  }
  return require.resolve(p)
}