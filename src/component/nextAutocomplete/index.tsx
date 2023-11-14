import React from 'react'
import types from './nextAutocompleteType.d'
import styles from './nextAutocompleteStyle.module.scss'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { CSSProperties } from 'react'

const NextAutocomplete = (props: types.ConfigProps) => {
  return (
    <Autocomplete
      className={styles['autocomplete']}
      style={{ '--width': props.width ?? 'auto' } as CSSProperties}
      label={props.label ?? 'autocomplete demo'}
      variant={props.variant ?? 'bordered'}
      placeholder={props.placeholder}
      labelPlacement="outside"
      isInvalid={!!props.errorMessage}
      errorMessage={props.errorMessage}
      defaultItems={props.defaultItems}
      defaultSelectedKey={String(props.defaultSelectedKey)}
      allowsCustomValue={props.allowCustomValue ?? true}
      onSelectionChange={props.onSelectionChange}
      onInputChange={props.onInputChange}
    >
      {item => (
        <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
      )}
    </Autocomplete>
  )
}

export default NextAutocomplete
