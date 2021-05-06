"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ContentPlugin;

var _loadFile = require("./loadFile");

var _loadDirectory = require("./loadDirectory");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var UnsupportedError = new Error('Unsupported configuration for babel-plugin-content-transformer');

function ContentPlugin(_ref) {
  var types = _ref.types;
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(p, state) {
        var opts = state.opts;

        if (opts.transformers) {
          var _iterator = _createForOfIteratorHelper(opts.transformers),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var t = _step.value;

              if (!t.file) {
                throw UnsupportedError;
              }

              if (p.node && p.node.source && t.file.test(p.node.source.value)) {
                (0, _loadFile.loadFile)(types, p, state, t);
                break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        if (opts.content) {
          var _iterator2 = _createForOfIteratorHelper(opts.content),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var c = _step2.value;

              if (!c.dir) {
                throw UnsupportedError;
              }

              if (p.node && p.node.source && c.dir.test(p.node.source.value)) {
                (0, _loadDirectory.loadDirectory)(types, p, state, c);
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }

        if (!(opts.transformers || opts.content)) {
          throw UnsupportedError;
        }
      }
    }
  };
}