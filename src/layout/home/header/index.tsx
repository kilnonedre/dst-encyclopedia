'use client'

import React from 'react'
import styles from './headerStyle.module.scss'
import { User } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter()

  const logout = () => {
    router.push('/')
  }

  return (
    <div className={styles['header']}>
      <User
        className={styles['header-user']}
        name="Jane Doe"
        description="Product Designer"
        avatarProps={{
          src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        }}
      />
      <div className={styles['header-logout']} onClick={logout}>
        退出
      </div>
    </div>
  )
}

export default Header
