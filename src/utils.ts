import * as path from 'path'

export type TransfomerDefinition = {
  format: string
} | {
  transform(contents: string): string
}

export function fixPath(p: string): string {
  p = path.normalize(p)
  if (p.endsWith('/')) {
    return p.slice(0, -1)
  } else if (p.endsWith('\\')) {
    return p.slice(0, -1)
  }
  return p
}

export function resolvePath (p: string, dirPath: string) {
  if (p.startsWith('.')) {
    return fixPath(path.join(dirPath, p))
  }
  try {
    return fixPath(require.resolve(p))
  } catch (err) {
    throw new Error(`Could not resolve path ${p}. Make sure to use ./ or ../ for relative paths.`)
  }
}

// export function mtime(filePath) {
//   try {
//     return statSync(filePath).mtimeMs
//   } catch {
//     return null
//   }
// }
