import { NextResponse } from 'next/server'
import types from './backendType.d'

export const response = (
  status: number,
  code: number,
  data: any,
  msg: string = 'success'
) => {
  const res = { code, data, msg }
  return NextResponse.json(res, { status })
}

export const tryRes = async (fun: Function, ...args: any) => {
  try {
    const result = await fun(...args)
    return { isSuccess: true, data: result }
  } catch (error: any) {
    return { isSuccess: false, error: error }
  }
}

export const dataNow = () => Math.round(Number(new Date()) / 1000)

export const formatFormData = (keyList: Array<string>, formData: FormData) => {
  const result: { [key: string]: any } = {}
  keyList.map(key => {
    result[key] = formData.get(key)
  })
  return result
}

export const getFilename = (file: string) => {
  return file.substring(0, file.lastIndexOf('.'))
}

export const getFileExtension = (file: string) => {
  return file.split('.').pop()
}

import jwt from 'jsonwebtoken'
import { BE_TOKEN_SECRET } from '@/config/env'

export const verifyJwt = async (authorization: string) => {
  if (!authorization || !authorization.includes('Bearer '))
    throw new Error('Token 不合法')
  const token = authorization.substring('Bearer '.length, authorization.length)
  const result = jwt.verify(token, BE_TOKEN_SECRET) as types.ConfigJwt
  console.log('result', result)
  return result
}
