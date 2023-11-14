'use client'

import './globalStyle.css'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'sonner'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Toaster closeButton richColors />
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  )
}

export default RootLayout
