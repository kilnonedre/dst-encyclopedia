type ConfigPostParams = FormData

interface ConfigTemporaryFile {
  id: number
  user_id: number
  file_name: string
  create_time: number
  update_time: number
}

export { ConfigPostParams, ConfigTemporaryFile }
