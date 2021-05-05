import * as fs from 'fs'
import * as path from 'path'

export function loadDirectory (t, p, state, opts) {
  const loc = p.node.source.value
  if (opts.dir.test(loc)) {
    const base = path.dirname(state.file.opts.filename)
    const fullPath = path.join(base, loc)
    const files = fs.readdirSync(fullPath)
    const keys = []
    const nodes = files.filter(f => !opts.filter || opts.filter.test(f)).map(f => {
      const key = path.basename(f).replace(path.extname(f), '')
      const identifier = t.identifier(key)
      keys.push(identifier)
      
      // TODO: This could be changed to a named import or default import
      return t.importDeclaration(
        [
          t.importNamespaceSpecifier(identifier)
        ],
        t.stringLiteral(path.join(loc, f))
      )
    })

    const arrId = t.identifier('files')
    const arrDeclaration = t.variableDeclaration(
      'const',
      [
        t.variableDeclarator(
          arrId, 
          t.arrayExpression(keys)
        )
      ]
    )

    const exportDeclaration = t.exportDefaultDeclaration(arrId)
    
    nodes.push(arrDeclaration, exportDeclaration)
    p.replaceWithMultiple(nodes)
  }
}