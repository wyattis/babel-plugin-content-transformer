"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ContentPlugin;

var _loadFile = require("./loadFile");

var _loadDirectory = require("./loadDirectory");

function ContentPlugin(_ref) {
  var t = _ref.types;
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(p, state) {
        var opts = state.opts;

        if (opts.file) {
          (0, _loadFile.loadFile)(t, p, state, opts);
        } else if (opts.dir) {
          (0, _loadDirectory.loadDirectory)(t, p, state, opts);
        } else {
          throw new Error('Unsupported configuration for babel-content-plugin');
        }
      }
    }
  };
}