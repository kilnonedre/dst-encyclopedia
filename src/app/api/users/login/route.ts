import { response, tryRes } from '@/util/backend'
import types from './loginType.d'
import userTypes from '../userType.d'
import { NextRequest } from 'next/server'
import dbQuery from '@/util/mysql'

const postFun = async ({ nickname, password }: types.ConfigPostParams) => {
  const sql = 'SELECT * FROM users WHERE nickname = ? AND password = ?'
  const userList = (await dbQuery(sql, [
    nickname,
    password,
  ])) as Array<userTypes.ConfigUser>
  if (userList.length === 0) throw new Error('用户不存在')
  return true
}

export const POST = async (request: NextRequest) => {
  const req = await request.json()
  const { isSuccess, error } = await tryRes(postFun, req)
  if (isSuccess) return response(200, 200, true)
  return response(200, 400, false, error.message)
}
