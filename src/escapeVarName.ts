export function replaceAll(val: string, pattern: RegExp, replacement: string) {
  let newVal = val
  do {
    val = newVal
    newVal = newVal.replace(pattern, replacement)
  } while (newVal !== val)
  return newVal
}

export function escapeVarName (name: string) {
  return replaceAll(name, /[-'"\(\)\\\/\?\.]/, '_')
}