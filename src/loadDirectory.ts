import type * as BabelCoreNamespace from '@babel/core'
import * as fs from 'fs'
import * as path from 'path'
import { escapeVarName } from './escapeVarName'
import { Options } from './plugin'
import { Identifier } from '@babel/types'

type API = typeof BabelCoreNamespace

export function loadDirectory (t: typeof BabelCoreNamespace.types, p: BabelCoreNamespace.NodePath<BabelCoreNamespace.types.ImportDeclaration>, state: BabelCoreNamespace.PluginPass, opts: Options) {
  if (p.node.specifiers.length > 1) {
    throw new Error(`Only default imports are supported. Check the import statement in ${state.file.opts.filename}`);
  } else if (!state.file.opts.filename) {
    throw new Error(`Could not determine filename for ${p.node.source.value}`)
  }

  const loc = p.node.source.value
  const specifier = p.node.specifiers[0]
  const id = specifier.local.name
  const base = path.dirname(state.file.opts.filename)
  const fullPath = path.join(base, loc)
  const files = fs.readdirSync(fullPath)
  const keys: Identifier[] = []
  
  const nodes = files.filter(f => !opts.filter || opts.filter.test(f)).map(f => {
    const key = path.basename(f).replace(path.extname(f), '')
    const identifier = t.identifier(escapeVarName(key))
    keys.push(identifier)
    let importPath = path.join(path.relative(base, fullPath), f)
    if (!importPath.startsWith('.')) {
      importPath = './' + importPath
    }
    return t.importDeclaration(
      [
        t.importNamespaceSpecifier(identifier)
      ],
      t.stringLiteral(importPath)
    )
  })

  const arrId = t.identifier(id)
  const arrDeclaration = t.variableDeclaration(
    'const',
    [
      t.variableDeclarator(
        arrId, 
        t.arrayExpression(keys)
      )
    ]
  )

  // @ts-ignore because it's trying to stop us from replacing the import declaration with a variable declaration
  nodes.push(arrDeclaration)
  p.replaceWithMultiple(nodes)
}