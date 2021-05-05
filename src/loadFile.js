import * as path from 'path'
import * as fs from 'fs'

export function loadFile (t, p, state, opts) {
  const specifier = p.node.specifiers[0]
  const id = specifier.local.name
  const loc = p.node.source.value
  const base = path.dirname(state.file.opts.filename)
  const full = path.join(base, loc)
  if (opts.file.test(loc)) {
    const fileContents = fs.readFileSync(full, 'utf-8')
    let transformedVal
    switch (opts.format) {
      case 'yaml':
        const YAML = require('yaml')
        transformedVal = t.valueToNode(YAML.parse(fileContents))
        break;
      case 'toml':
        const toml = require('toml')
        transformedVal = t.valueToNode(toml.parse(fileContents))
        break;
      case 'remark':
        // TODO
        break;
      default:
        // Replace with constant string
        transformedVal = t.stringLiteral(fileContents)
    }
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
}