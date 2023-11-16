import { response, tryRes, dataNow } from '@/util/backend'
import { NextRequest } from 'next/server'
import types from './resourceType.d'
import mysqlTypes from '@/type/mysqlType.d'
import modTypes from '../mods/modType.d'
import dbQuery from '@/util/mysql'

const getFun = async ({ name, mod, page }: types.ConfigGetParams) => {
  const sql = `SELECT resources.*, mods.name AS mod_name FROM resources JOIN mods ON resources.mod_id = mods.id WHERE resources.name LIKE "%${name}%" ${
    mod ? 'AND resources.mod_id = ?' : ''
  } ORDER BY id`
  const resourceList = (await dbQuery(sql, [
    [[mod]],
  ])) as Array<types.ConfigResource>
  const start = (page - 1) * 10
  const result = {
    resourceList: resourceList.slice(start, start + 10),
    total: resourceList.length,
  }
  return result
}

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams
  const name = query.get('name')
  const mod = query.get('mod')
  const page = Number(query.get('page'))
  const params = { name, mod, page }
  const { isSuccess, data, error } = await tryRes(getFun, params)
  if (isSuccess) return response(200, 200, data)
  return response(200, 400, false, error.message)
}

const intoMods = async (mod: number | string) => {
  let sql = 'SELECT * FROM mods WHERE name = ?'
  const modList = (await dbQuery(sql, [[[mod]]])) as Array<modTypes.ConfigMod>
  if (modList.length > 0) return modList[0].id
  sql = 'INSERT INTO mods (name, create_time, update_time) VALUES ?'
  const dbMsg = (await dbQuery(sql, [
    [[mod, dataNow(), dataNow()]],
  ])) as mysqlTypes.ConfigInto
  return dbMsg.insertId
}

const postFun = async ({ name, code, mod }: types.ConfigPostParams) => {
  let sql = 'SELECT * FROM resources WHERE name = ?'
  const resourceList = (await dbQuery(sql, [
    [[name]],
  ])) as Array<types.ConfigResource>
  if (resourceList.length > 0) throw new Error('词条已存在')
  if (typeof mod === 'string') {
    mod = await intoMods(mod)
  }
  sql =
    'INSERT INTO resources (name, code, mod_id, create_time, update_time) VALUES ?'
  await dbQuery(sql, [[[name, code, mod, dataNow(), dataNow()]]])
  return true
}

export const POST = async (request: NextRequest) => {
  const req = await request.json()
  const { isSuccess, error } = await tryRes(postFun, req)
  if (isSuccess) return response(200, 200, true)
  return response(200, 400, false, error.message)
}

const putFun = async ({ id, name, code, mod }: types.ConfigPutParams) => {
  if (typeof mod === 'string') {
    mod = await intoMods(mod)
  }
  const sql =
    'UPDATE resources SET name = ?, code = ?, mod_id = ?, update_time = ? WHERE id = ?'
  await dbQuery(sql, [name, code, mod, dataNow(), id])
  return true
}

export const PUT = async (request: NextRequest) => {
  const req = await request.json()
  const { isSuccess, error } = await tryRes(putFun, req)
  if (isSuccess) return response(200, 200, true)
  return response(200, 400, false, error.message)
}

const deleteFun = async ({ id }: types.ConfigDeleteParams) => {
  const sql = 'DELETE FROM resources WHERE id = ?'
  await dbQuery(sql, [id])
  return true
}

export const DELETE = async (request: NextRequest) => {
  const req = await request.json()
  const { isSuccess, error } = await tryRes(deleteFun, req)
  if (isSuccess) return response(200, 200, true)
  return response(200, 400, error.message)
}
