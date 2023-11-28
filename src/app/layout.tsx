'use client'

import React, { useEffect } from 'react'
import './globalStyle.css'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster, toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const router = useRouter()

  const noVerifyPageList = ['/']

  useEffect(() => {
    const index = noVerifyPageList.indexOf(pathname)
    if (index === -1 && !localStorage.getItem('DST_Token')) {
      toast.error('Token 不存在，请重新登录')
      router.push('/')
    }
  }, [pathname])

  return (
    <html lang="zh-CN">
      <body>
        <Toaster closeButton richColors />
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  )
}

export default RootLayout
