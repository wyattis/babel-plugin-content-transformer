import * as path from 'path'
import * as fs from 'fs'

export function loadFile (t, p, state, opts) {
  const loc = p.node.source.value

  if (opts.file.test(loc)) {

    if (p.node.specifiers.length > 1) {
      throw new Error(`Only default imports are supported. Check the import statement for '${loc}' in ${state.file.opts.filename}`);
    }

    const specifier = p.node.specifiers[0]
    const id = specifier.local.name
    const base = path.dirname(state.file.opts.filename)
    const full = path.join(base, loc)

    // Function that transforms content into an AST node
    let transformer = contents => t.valueToNode(contents)

    if (opts.transform) {
      transformer = contents => {
        return t.valueToNode(opts.transform(contents))
      }
    } else {
      switch (opts.format) {
        case 'yaml':
          const YAML = require('yaml')
          transformer = contents => t.valueToNode(YAML.parse(contents))
          break;
        case 'toml':
          const toml = require('toml')
          transformer = contents => t.valueToNode(toml.parse(contents))
          break;
        case 'remark':
          // TODO
          break;
        default:
          transformer = contents => t.stringLiteral(contents)
      }
    }

    const fileContents = fs.readFileSync(full, 'utf-8')
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
}