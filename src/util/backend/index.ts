import { NextResponse } from 'next/server'

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
