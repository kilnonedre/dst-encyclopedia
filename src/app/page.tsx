'use client'

import React, { useEffect, useState } from 'react'
import styles from './indexStyle.module.scss'
import { Button } from '@nextui-org/react'
import { CreateDatabase, CheckDatabase } from '@/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const Index = () => {
  const [isNeedCreate, setIsNeedCreate] = useState(false)

  const router = useRouter()

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
    goHome()
  }

  const goHome = () => {
    router.push('/home/resource')
  }

  return (
    <div className={styles['index']}>
      {isNeedCreate ? (
        <Button color="danger" onPress={createDataBase}>
          创建数据库
        </Button>
      ) : (
        <Button color="primary" onPress={goHome}>
          进入首页
        </Button>
      )}
    </div>
  )
}

export default Index
