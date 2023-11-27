'use client'

import React, { useEffect, useState } from 'react'
import styles from './indexStyle.module.scss'
import { Button, Input } from '@nextui-org/react'
import { CreateDatabase, CheckDatabase, Login, Register } from '@/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import nextUITypes from '@/type/nextUIType.d'

const Index = () => {
  const [isNeedCreate, setIsNeedCreate] = useState(false)
  const [createDBLoad, setCreateDBLoad] = useState(false)
  const [registerLoad, setRegisterLoad] = useState(false)
  const [loginLoad, setLoginLoad] = useState(false)
  const [nickname, setNickname] = useState('')
  const [nicknameErrMsg, setNicknameErrMsg] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErrMsg, setPasswordErrMsg] = useState('')

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
    setCreateDBLoad(true)
    const response = await CreateDatabase()
    const { code, data, msg } = await response.json()
    setCreateDBLoad(false)
    if (code !== 200) {
      toast.error(msg)
      return
    }
    toast.success('数据库创建成功')
    setIsNeedCreate(!data)
  }

  const check = () => {
    if (!nickname.trim()) {
      setNicknameErrMsg('请输入昵称')
      return false
    }
    if (!password.trim()) {
      setPasswordErrMsg('请输入密码')
      return false
    }
    return true
  }

  const goHome = () => {
    router.push('/admin/resource')
  }

  const login = async () => {
    const result = check()
    if (!result) return
    setLoginLoad(true)
    const params = { nickname, password }
    const response = await Login(params)
    const { code, data, msg } = await response.json()
    setLoginLoad(false)
    if (code !== 200) {
      toast.error(msg)
      return
    }
    toast.success('登录成功')
    localStorage.setItem('DST_Token', data)
    goHome()
  }

  const register = async () => {
    const result = check()
    if (!result) return
    setRegisterLoad(true)
    const params = { nickname, password }
    const response = await Register(params)
    const { code, msg } = await response.json()
    setRegisterLoad(false)
    if (code !== 200) {
      toast.error(msg)
      return
    }
    toast.success('注册成功')
    login()
  }

  const changePassword = (e: string) => {
    passwordErrMsg && setPasswordErrMsg('')
    setPassword(e)
  }

  const changeNickname = (e: string) => {
    nicknameErrMsg && setNicknameErrMsg('')
    setNickname(e)
  }

  const buttonList = [
    {
      mark: 'login',
      label: '登录',
      color: 'primary',
      function: login,
      isShow: !isNeedCreate,
      isLoad: loginLoad,
    },
    {
      mark: 'signUp',
      label: '注册',
      color: 'default',
      function: register,
      isShow: !isNeedCreate,
      isLoad: registerLoad,
    },
    {
      mark: 'createDB',
      label: '创建数据库',
      color: 'danger',
      function: createDataBase,
      isShow: isNeedCreate,
      isLoad: createDBLoad,
    },
  ]

  return (
    <div className={styles['index']}>
      <div className={styles['index-login']}>
        <div className={styles['index-login-title']}>Steam</div>
        <div className={styles['index-login-title']}>饥荒</div>
        <div className={styles['index-login-tip']}>后台管理系统</div>
        <Input
          type="text"
          variant="bordered"
          isClearable
          label="邮箱"
          placeholder="请输入昵称"
          isInvalid={!!nicknameErrMsg}
          errorMessage={nicknameErrMsg}
          value={nickname}
          onValueChange={changeNickname}
        />
        <Input
          type="password"
          variant="bordered"
          className={styles['index-login-password']}
          isClearable
          label="密码"
          placeholder="请输入密码"
          isInvalid={!!passwordErrMsg}
          errorMessage={passwordErrMsg}
          value={password}
          onValueChange={changePassword}
        />
        {buttonList.map(button => {
          return button.isShow ? (
            <Button
              key={button.mark}
              className={styles['index-login-button']}
              color={button.color as nextUITypes.ConfigColor}
              onClick={button.function}
              isLoading={button.isLoad}
            >
              {button.label}
            </Button>
          ) : null
        })}
      </div>
    </div>
  )
}

export default Index
