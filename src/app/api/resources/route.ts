import {
  response,
  tryRes,
  dataNow,
  getFileExtension,
  verifyJwt,
} from '@/util/backend'
import { NextRequest } from 'next/server'
import types from './resourceType.d'
import fileTypes from '../files/fileType'
import mysqlTypes from '@/type/mysqlType.d'
import modTypes from '../mods/modType.d'
import dbQuery from '@/util/mysql'
import { renameSync, unlinkSync } from 'fs'
import { FILE_PATH_ALL } from '@/config/env'
import { join } from 'path'

const fileReName = async (
  code: String,
  thumbnail: string,
  fileName: string
) => {
  const fileExtension = getFileExtension(thumbnail)
  const oldFilePath = join(FILE_PATH_ALL, 'upload', fileName)
  const newFilePath = join(FILE_PATH_ALL, 'upload', `${code}.${fileExtension}`)
  await renameSync(oldFilePath, newFilePath)
  return join('upload', `${code}.${fileExtension}`)
}

const removeImage = async (authorization: string, fileName: string) => {
  const jwt = await verifyJwt(authorization)
  let sql = 'SELECT * FROM temporaryFiles WHERE user_id = ?'
  const temporaryFileList = (await dbQuery(sql, [
    jwt.user_id,
  ])) as Array<fileTypes.ConfigTemporaryFile>
  console.log('fileName', fileName)
  temporaryFileList.map(temporaryFile => {
    if (fileName !== temporaryFile.file_name) {
      const filePath = join(FILE_PATH_ALL, 'upload', temporaryFile.file_name)
      unlinkSync(filePath)
    }
  })
  sql = 'DELETE FROM temporaryFiles WHERE user_id = ?'
  await dbQuery(sql, [jwt.user_id])
}

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

const postFun = async ({
  name,
  code,
  mod,
  thumbnail,
  authorization,
}: types.ConfigPostFunParams) => {
  let sql = 'SELECT * FROM resources WHERE name = ? OR code = ?'
  const resourceList = (await dbQuery(sql, [
    name,
    code,
  ])) as Array<types.ConfigResource>
  if (resourceList.length > 0) throw new Error('词条已存在')
  if (typeof mod === 'string') {
    mod = await intoMods(mod)
  }
  const fileName = thumbnail.split('\\').pop() as string
  if (thumbnail) {
    thumbnail = await fileReName(code, thumbnail, fileName)
  }
  sql =
    'INSERT INTO resources (name, code, mod_id, thumbnail, create_time, update_time) VALUES ?'
  await dbQuery(sql, [[[name, code, mod, thumbnail, dataNow(), dataNow()]]])
  await removeImage(authorization, fileName)
  return true
}

export const POST = async (request: NextRequest) => {
  const req = await request.json()
  req.authorization = request.headers.get('Authorization')
  const { isSuccess, error } = await tryRes(postFun, req)
  if (isSuccess) return response(200, 200, true)
  return response(200, 400, false, error.message)
}

const putFun = async ({
  id,
  name,
  code,
  mod,
  thumbnail,
  authorization,
}: types.ConfigPutFunParams) => {
  if (typeof mod === 'string') {
    mod = await intoMods(mod)
  }
  const fileName = thumbnail.split('\\').pop() as string
  if (thumbnail) {
    thumbnail = await fileReName(code, thumbnail, fileName)
  }
  const sql =
    'UPDATE resources SET name = ?, code = ?, mod_id = ?, thumbnail = ?, update_time = ? WHERE id = ?'
  await dbQuery(sql, [name, code, mod, thumbnail, dataNow(), id])
  await removeImage(authorization, fileName)
  return true
}

export const PUT = async (request: NextRequest) => {
  const req = await request.json()
  req.authorization = request.headers.get('Authorization')
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
