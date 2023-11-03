'use client'

import './globalStyle.scss'
import { NextUIProvider } from '@nextui-org/react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  )
}

export default RootLayout
