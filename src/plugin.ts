import type * as BabelCoreNamespace from '@babel/core'
import type { PluginObj } from '@babel/core'
import { TransfomerDefinition, resolvePath } from "./utils"
import { readdirSync, statSync } from 'fs'
import { loadFile } from './loadFile'
import path from 'path'
import { loadDirectory } from './loadDirectory'

type API = typeof BabelCoreNamespace

export type Options =  {
  source: string | string[]
  recursive?: boolean
  nocache?: boolean
  filter?: { test: (path: string) => boolean }
} & TransfomerDefinition

function addDependencies (api: API, options: Options, sources: string[]) {
  const dependencies = new Set()
  if (options.nocache) {
    console.error('skipping cache')
    // @ts-ignore
    api.cache.never()
  }

  for (const src of sources) {
    if (!options.nocache) {
      // @ts-ignore
      api.cache.using(() => {
        const key = statSync(src).mtimeMs
        console.error('cache key', src, key)
        return key
      })
    }
    console.error('adding dependency', src)
    // @ts-ignore
    api.addExternalDependency(src)
    if (!isDirectory(src)) {
      dependencies.add(src)
      break
    }
    let files = readdirSync(src, { recursive: options.recursive, encoding: 'utf-8' })
    if (options.filter) {
      files = files.filter(file => options.filter!.test(file))
    }
    for (let file of files) {
      file = path.join(src, file)
      dependencies.add(file)
    }
  }

  return dependencies
}

function validateOptions (opts: Options) {
  if (!opts.source) {
    if ('content' in opts) {
      throw new Error('"content" field is no longer supported')
    } else if ('transformers' in opts) {
      throw new Error('"transformers" field is no longer supported')
    } else {
      throw new Error('Missing required "source" field')
    }
  } else if (typeof opts.source === 'string' && opts.source.trim() === '' || opts.source.length === 0) {
    throw new Error('"source" field cannot be empty')
  }
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

export const Plugin = function (api: API, options: Options): PluginObj {
  validateOptions(options)
  let sources: string[] = []
  if (typeof options.source === 'string') {
    sources = [options.source]
  } else {
    sources = options.source
  }
  sources = sources.map(s => resolvePath(s, process.cwd()))
  const files = addDependencies(api, options, sources)
  const hasTransform = 'transform' in options || 'format' in options
  return {
    visitor: {
      ImportDeclaration (p, state) {
        if (p.node && p.node.source && state.file.opts.filename) {
          const dirPath = path.dirname(state.file.opts.filename)
          const fullPath = resolvePath(p.node.source.value, dirPath)
          if (isDirectory(fullPath) && sources.includes(fullPath)) {
            loadDirectory(api.types, p, state, options)
          } else if (hasTransform && files.has(fullPath)) {
            // Handle transformation of a single file
            loadFile(api.types, p, state, options)
          }
        }
      }
    },
  }
}