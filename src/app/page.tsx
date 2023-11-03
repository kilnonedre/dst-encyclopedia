'use client'

import React from 'react'
import styles from './indexStyle.module.scss'
import { Snippet } from '@nextui-org/react'

const Index = () => {
  return (
    <div className={styles['index']}>
      <Snippet>npm install @nextui-org/react</Snippet>
    </div>
  )
}

export default Index
