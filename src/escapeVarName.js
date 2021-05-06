export function replaceAll(val, pattern, replacement) {
  let newVal = val
  do {
    val = newVal
    newVal = newVal.replace(pattern, replacement)
  } while (newVal !== val)
  return newVal
}

export function escapeVarName (name) {
  return replaceAll(name, /[-'"\(\)\\\/\?\.]/, '_')
}