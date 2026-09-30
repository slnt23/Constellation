export interface UiThemeDefinition {
  id: string
  name: string
  description: string
  preview: {
    background: string
    surface: string
    primary: string
    text: string
  }
}
