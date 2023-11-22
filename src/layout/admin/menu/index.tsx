'use client'

import React from 'react'
import styles from './menuStyle.module.scss'
import { usePathname } from 'next/navigation'
import { adminRouterList } from '@/router/children/adminRouter'
import Link from 'next/link'

const menuList = adminRouterList

const Menu = () => {
  let pathname = usePathname().split('/').pop()

  return (
    <div className={styles['menu']}>
      {menuList.map(menu => {
        if (pathname === 'admin') {
          pathname = ''
        }
        const isActive = pathname === menu.href
        return (
          <div key={menu.mark} className={styles['menu-item']}>
            <Link
              href={`/admin/${menu.href}`}
              className={`${styles['menu-item-main']} ${
                isActive && styles['active']
              }`}
            >
              {menu.name}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Menu
