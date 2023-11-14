import { response, tryRes } from '@/util/backend'
import types from './modType.d'
import dbQuery from '@/util/mysql'

const getFun = async () => {
  const sql = 'SELECT * FROM mods'
  const modList = (await dbQuery(sql, [])) as Array<types.ConfigMod>
  return modList
}

export const GET = async () => {
  const { isSuccess, data, error } = await tryRes(getFun)
  if (isSuccess) return response(200, 200, data)
  return response(200, 400, false, error.message)
}
