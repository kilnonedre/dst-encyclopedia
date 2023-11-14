import React from 'react'
import styles from './iconStyle.module.scss'
import types from './iconType.d'

const Icon = (props: types.ConfigProps) => {
  const style = {
    fontSize: props.size ?? '1rem',
    color: props.color,
    cursor: props.cursor ?? 'pointer',
  }

  return (
    <i className={styles['icon']} style={style} onClick={props.onPress}>
      {props.font}
    </i>
  )
}

export default Icon
