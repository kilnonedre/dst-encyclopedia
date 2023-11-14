import nextUITypes from '@/type/nextUIType.d'

interface ConfigList {
  label: number | string
  value: number | string
}

interface ConfigProps {
  label?: string
  variant?: nextUITypes.ConfigVariant
  placeholder: string
  defaultItems: Array<ConfigList>
  defaultSelectedKey?: string | number
  errorMessage?: string
  allowCustomValue?: boolean
  onSelectionChange: function
  onInputChange?: function
  width?: string
}

export { ConfigProps }
