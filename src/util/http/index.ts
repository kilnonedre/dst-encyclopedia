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

const Get = (url: string, params?: object, config?: object) => {
  let suffix = ''
  if (params) {
    const values = Object.values(params)
    Object.keys(params).forEach((key, index) => {
      suffix = `${suffix}&${key}=${values[index]}`
    })
    suffix = `?${suffix.slice(1)}`
  }
  return fetch(`${url}${suffix}`, {
    method: 'GET',
    ...getToken(),
    ...config,
  })
}

const Post = (url: string, params?: object, config?: object) => {
  const body = (isFormData(params) ? params : JSON.stringify(params)) as
    | FormData
    | string
  return fetch(url, {
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
  return fetch(url, {
    method: 'PUT',
    body,
    ...getToken(),
    ...config,
  })
}

const Delete = (url: string, params?: object, config?: object) => {
  return fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(params),
    ...getToken(),
    ...config,
  })
}

export { joinPath, Get, Post, Put, Delete }
