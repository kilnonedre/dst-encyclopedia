'use client'

import React from 'react'
import styles from './menuStyle.module.scss'
import { usePathname } from 'next/navigation'
import { homeRouterList } from '@/router/children/homeRouter'
import Link from 'next/link'

const menuList = homeRouterList

const Menu = () => {
  let pathname = usePathname().split('/').pop()

  return (
    <div className={styles['menu']}>
      {menuList.map(menu => {
        if (pathname === 'home') {
          pathname = ''
        }
        const isActive = pathname === menu.href
        return (
          <div key={menu.mark} className={styles['menu-item']}>
            <Link
              href={`/home/${menu.href}`}
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
