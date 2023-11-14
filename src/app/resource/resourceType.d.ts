import resourceTypes from '@/app/api/resources/resourceType.d'

interface ConfigResource extends resourceTypes.ConfigResource {
  serial: number
  mod_name: string
}

interface ConfigMod {
  id: number
  label: string
  value: string
}

type ConfigColumnKey = 'serial' | 'name' | 'code' | 'mod_name' | 'action'

export { ConfigResource, ConfigColumnKey, ConfigMod }
