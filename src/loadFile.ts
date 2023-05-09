import type * as BabelCoreNamespace from '@babel/core'
import * as fs from 'fs'
import path from 'path'
import { resolvePath } from './utils'
import type { Options } from './plugin'
import { Expression } from '@babel/types'

type API = typeof BabelCoreNamespace

export function loadFile (t: typeof BabelCoreNamespace.types, p: BabelCoreNamespace.NodePath<BabelCoreNamespace.types.ImportDeclaration>, state: BabelCoreNamespace.PluginPass, opts: Options) {

  if (p.node.specifiers.length > 1) {
    throw new Error(`Only default imports are supported. Check the import statement in ${state.file.opts.filename}`);
  } else if (!state.file.opts.filename) {
    throw new Error(`Could not determine filename for ${p.node.source.value}`)
  }

  const specifier = p.node.specifiers[0]
  const id = specifier.local.name

  // Function that transforms content into an AST node
  let transformer: (v: string) => Expression = (contents: string) => t.valueToNode(contents)
  if ("transform" in opts) {
    transformer = contents => {
      return t.valueToNode(opts.transform(contents))
    }
  } else {
    switch (opts.format) {
      case 'yaml':
        const YAML = require('yaml')
        transformer = contents => t.valueToNode(YAML.parse(contents))
        break
      case 'toml':
        const toml = require('toml')
        transformer = contents => t.valueToNode(toml.parse(contents))
        break
      default:
        transformer = contents => t.stringLiteral(contents)
    }
  }

  const fileDir = path.dirname(state.file.opts.filename)
  const fullPath = resolvePath(p.node.source.value, fileDir)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')
  const transformedVal = transformer(fileContents)
  
  p.replaceWith({
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      t.variableDeclarator(t.identifier(id), transformedVal)
    ],
    leadingComments: [{
      type: 'CommentBlock',
      value: `babel-content-loader '${p.node.source.value}'`
    }]
  })

}