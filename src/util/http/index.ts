import types from './httpType.d'

const isFormData = (object: object | undefined) => {
  if (Object.prototype.toString.call(object) !== '[object FormData]')
    return false
  return true
}

const joinPath = (url: string, route?: string | number) => {
  const path = `/${route}` ?? ''
  return `${url}${path}`
}

const getToken = () => {
  const token = localStorage.getItem('DST_Token')
  if (token) return { headers: { Authorization: `Bearer ${token}` } }
  return {}
}

const errMessageObj = {
  400: '请求错误(400)',
  401: '登录已过期，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)',
  505: 'HTTP版本不受支持(505)',
}

const errMessage = (status: types.ConfigErrStatus) => {
  const message = errMessageObj[status] ?? `连接出错(${status})`
  return `${message}，请检查网络或联系管理员！`
}

import { toast } from 'sonner'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

let router: null | AppRouterInstance = null

const setRouter = (Router: AppRouterInstance) => {
  router = Router
}

const fetchWithInterceptor = (url: string, options: object) => {
  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        const errMsg = errMessage(response.status as types.ConfigErrStatus)
        toast.error(errMsg)
        if (response.status === 401) {
          router && router.push('/')
          localStorage.removeItem('DST_Token')
        }
        throw new Error('网络请求错误: ' + response.status)
      }
      return response
    })
    .catch(error => {
      throw error
    })
}

const Get = (url: string, params?: object, config?: object) => {
  let suffix = ''
  if (params) {
    const values = Object.values(params)
    Object.keys(params).forEach((key, index) => {
      suffix = `${suffix}&${key}=${values[index]}`
    })
    suffix = `?${suffix.slice(1)}`
  }
  return fetchWithInterceptor(`${url}${suffix}`, {
    method: 'GET',
    ...getToken(),
    ...config,
  })
}

const Post = (url: string, params?: object, config?: object) => {
  const body = (isFormData(params) ? params : JSON.stringify(params)) as
    | FormData
    | string
  return fetchWithInterceptor(url, {
    method: 'POST',
    body,
    ...getToken(),
    ...config,
  })
}

const Put = (url: string, params?: object, config?: object) => {
  const body = (isFormData(params) ? params : JSON.stringify(params)) as
    | FormData
    | string
  return fetchWithInterceptor(url, {
    method: 'PUT',
    body,
    ...getToken(),
    ...config,
  })
}

const Delete = (url: string, params?: object, config?: object) => {
  return fetchWithInterceptor(url, {
    method: 'DELETE',
    body: JSON.stringify(params),
    ...getToken(),
    ...config,
  })
}

export { joinPath, Get, Post, Put, Delete, setRouter }
