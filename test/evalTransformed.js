export function evalTransformed (transformed) {
  try {
    return eval(`
      (function () {
        ${transformed.code};
        return exports.default;
      })()
    `)
  } catch (err) {
    console.error('failed to eval')
    console.log(transformed.code)
  }
}