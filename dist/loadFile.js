"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFile = loadFile;

var path = _interopRequireWildcard(require("path"));

var fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function loadFile(t, p, state, opts) {
  var loc = p.node.source.value;

  if (opts.file.test(loc)) {
    if (p.node.specifiers.length > 1) {
      throw new Error("Only default imports are supported. Check the import statement for '".concat(loc, "' in ").concat(state.file.opts.filename));
    }

    var specifier = p.node.specifiers[0];
    var id = specifier.local.name;
    var base = path.dirname(state.file.opts.filename);
    var full = path.join(base, loc); // Function that transforms content into an AST node

    var transformer = function transformer(contents) {
      return t.valueToNode(contents);
    };

    if (opts.transform) {
      transformer = function transformer(contents) {
        return t.valueToNode(opts.transform(contents));
      };
    } else {
      switch (opts.format) {
        case 'yaml':
          var YAML = require('yaml');

          transformer = function transformer(contents) {
            return t.valueToNode(YAML.parse(contents));
          };

          break;

        case 'toml':
          var toml = require('toml');

          transformer = function transformer(contents) {
            return t.valueToNode(toml.parse(contents));
          };

          break;

        case 'remark':
          // TODO
          break;

        default:
          transformer = function transformer(contents) {
            return t.stringLiteral(contents);
          };

      }
    }

    var fileContents = fs.readFileSync(full, 'utf-8');
    var transformedVal = transformer(fileContents);
    p.replaceWith({
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [t.variableDeclarator(t.identifier(id), transformedVal)],
      leadingComments: [{
        type: 'CommentBlock',
        value: "babel-content-loader '".concat(p.node.source.value, "'")
      }]
    });
  }
}