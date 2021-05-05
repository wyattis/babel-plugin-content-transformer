type TransformOptions = {
  file: RegExp
}

export type FrontmatterOptions = {
  format: 'frontmatter',
  options: {
    bodyKey?: string
  }
} & TransformOptions

export type YamlOptions = {
  format: 'yaml'
} & TransformOptions

export type TomlOptions = {
  format: 'toml'
} & TransformOptions


export type ReducerOptions = {
  match: RegExp
  file?: RegExp
  reducer? (): any[]
}

export type PluginOptions = FrontmatterOptions | YamlOptions | TomlOptions | ReducerOptions
