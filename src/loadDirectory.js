import * as fs from 'fs'
import * as path from 'path'
import { escapeVarName } from './escapeVarName'

export function loadDirectory (t, p, state, opts) {
  if (p.node.source && p.node.source.value && opts.dir.test(p.node.source.value)) {
    
    if (p.node.specifiers.length > 1) {
      throw new Error(`Only default imports are supported. Check the import statement for '${loc}' in ${state.file.opts.filename}`);
    }

    const loc = p.node.source.value
    const specifier = p.node.specifiers[0]
    const id = specifier.local.name
    const base = path.dirname(state.file.opts.filename)
    const fullPath = path.join(base, loc)
    const files = fs.readdirSync(fullPath)
    const keys = []
    
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

    nodes.push(arrDeclaration)
    p.replaceWithMultiple(nodes)
  }
}