'use client'

import React, { useEffect, useState } from 'react'
import styles from './indexStyle.module.scss'
import { Button } from '@nextui-org/react'
import { CreateDatabase, CheckDatabase } from '@/api'
import { toast } from 'sonner'

const Index = () => {
  const [isNeedCreate, setIsNeedCreate] = useState(false)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    const response = await CheckDatabase()
    const { code, data, msg } = await response.json()
    if (code !== 200) {
      toast.error(msg)
      return
    }
    setIsNeedCreate(!data)
  }

  const createDataBase = async () => {
    const response = await CreateDatabase()
    const { code, msg } = await response.json()
    if (code !== 200) {
      toast.error(msg)
      return
    }
    toast.success('数据库创建成功')
  }

  return (
    <div className={styles['index']}>
      <Button onClick={createDataBase}>
        {isNeedCreate ? '创建数据库' : ''}
      </Button>
    </div>
  )
}

export default Index
