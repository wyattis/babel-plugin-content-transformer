export function evalTransformed (transformed) {
  try {
    return eval(`
      (function () {
        ${transformed.code};
        return exports.default;
      })()
    `)
  } catch (err) {
    console.log(transformed.code)
  }
}