interface ConfigResource {
  id: number
  name: string
  code: string
  thumbnail: string
  mod_id: number
  create_time: number
  update_time: number
}

interface ConfigPostParams {
  name: string
  code: string
  mod: string | number
  thumbnail: string
}

interface ConfigGetParams {
  name: string
  mod: string
  page: number
}

interface ConfigPutParams extends ConfigPostParams {
  id: number
}

interface ConfigDeleteParams {
  id: number
}

interface ConfigPutFunParams extends ConfigPutParams {
  authorization: string
}

interface ConfigPostFunParams extends ConfigPostParams {
  authorization: string
}

export {
  ConfigResource,
  ConfigPostParams,
  ConfigPostFunParams,
  ConfigGetParams,
  ConfigPutParams,
  ConfigPutFunParams,
  ConfigDeleteParams,
}
