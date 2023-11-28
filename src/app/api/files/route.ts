import { response, tryRes, formatFormData, dataNow } from '@/util/backend'
import { verifyToken } from '@/util/backend/token'
import { writeFile } from 'fs/promises'
import { NextRequest } from 'next/server'
import { FILE_PATH_ALL } from '@/config/env'
import { join } from 'path'
import dbQuery from '@/util/mysql'
import types from './fileType.d'

const postFun = async (request: NextRequest) => {
  const formData = await request.formData()
  const keyList = ['file']
  const { file } = formatFormData(keyList, formData)
  const fileName = `temporary_${file.name}`
  const authorization = request.headers.get('Authorization') as string
  const jwt = await verifyToken(authorization)
  let sql = 'SELECT * FROM temporaryFiles WHERE user_id = ? AND file_name = ?'
  const temporaryFileList = (await dbQuery(sql, [
    jwt.user_id,
    fileName,
  ])) as Array<types.ConfigTemporaryFile>
  if (temporaryFileList.length === 0) {
    sql =
      'INSERT INTO temporaryFiles (user_id, file_name, create_time, update_time) VALUES ?'
    await dbQuery(sql, [[[jwt.user_id, fileName, dataNow(), dataNow()]]])
  }
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filePath = join(FILE_PATH_ALL, 'upload', fileName)
  await writeFile(filePath, buffer)
  const result = join('upload', fileName)
  return result
}

export const POST = async (request: NextRequest) => {
  const { isSuccess, data, error } = await tryRes(postFun, request)
  if (isSuccess) return response(200, 200, data)
  return response(200, 400, false, error.message)
}
