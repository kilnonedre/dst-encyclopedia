'use client'

import React from 'react'
import { Button } from '@nextui-org/react'
import { RunScript } from '@/api'
import { toast } from 'sonner'

const Database = () => {
  const runScript = async () => {
    const response = await RunScript()
    const { code, msg } = await response.json()
    if (code !== 200) return toast.error(msg)
    toast.success('脚本执行成功')
  }

  return (
    <div>
      <Button onPress={runScript}>运行脚本</Button>
    </div>
  )
}

export default Database
