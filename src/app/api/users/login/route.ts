import { response, tryRes } from '@/util/backend'
import types from './loginType.d'
import userTypes from '../userType.d'
import { NextRequest } from 'next/server'
import dbQuery from '@/util/mysql'
import { BE_TOKEN_SECRET, BE_TOKEN_VALID } from '@/config/env'
import jwt from 'jsonwebtoken'

const postFun = async ({ nickname, password }: types.ConfigPostParams) => {
  const sql = 'SELECT * FROM users WHERE nickname = ?'
  const userList = (await dbQuery(sql, [
    nickname,
  ])) as Array<userTypes.ConfigUser>
  if (userList.length === 0) throw new Error('用户不存在')
  else if (userList[0].password !== password) throw new Error('密码错误')
  const token = jwt.sign(
    { nickname, user_id: userList[0].id },
    BE_TOKEN_SECRET,
    { expiresIn: BE_TOKEN_VALID }
  )
  return token
}

export const POST = async (request: NextRequest) => {
  const req = await request.json()
  const { isSuccess, data, error } = await tryRes(postFun, req)
  if (isSuccess) return response(200, 200, data)
  return response(200, 400, false, error.message)
}
