export function evalTransformed (transformed) {
  return eval(`
    (function () {
      ${transformed.code};
      return exports.default;
    })()
  `)
}