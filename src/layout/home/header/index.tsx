'use client'

import React from 'react'
import styles from './headerStyle.module.scss'
import { User } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import img from '@/asset/avatar/avatar.png'

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
          src: img.src,
          isBordered: true,
        }}
      />
      <div className={styles['header-logout']} onClick={logout}>
        退出
      </div>
    </div>
  )
}

export default Header
