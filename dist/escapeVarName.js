"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceAll = replaceAll;
exports.escapeVarName = escapeVarName;

function replaceAll(val, pattern, replacement) {
  var newVal = val;

  do {
    val = newVal;
    newVal = newVal.replace(pattern, replacement);
  } while (newVal !== val);

  return newVal;
}

function escapeVarName(name) {
  return replaceAll(name, /[-'"\(\)\\\/\?\.]/, '_');
}