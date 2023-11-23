import { response, tryRes, formatFormData } from '@/util/backend'
import { writeFile } from 'fs/promises'
import { NextRequest } from 'next/server'
import { FILE_PATH_ALL } from '@/config/env'
import { join } from 'path'

const postFun = async (request: NextRequest) => {
  const formData = await request.formData()
  const keyList = ['file']
  const { file } = formatFormData(keyList, formData)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filePath = join(FILE_PATH_ALL, 'upload', file.name)
  await writeFile(filePath, buffer)
  const result = join('upload', file.name)
  return result
}

export const POST = async (request: NextRequest) => {
  const { isSuccess, data, error } = await tryRes(postFun, request)
  if (isSuccess) return response(200, 200, data)
  return response(200, 400, false, error.message)
}
