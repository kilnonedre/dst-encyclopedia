import { ConfigResource, ConfigMode } from '@/app/admin/resource/resourceType'

interface ConfigProps {
  mode: ConfigMode
  isOpen: boolean
  onOpen: function
  onOpenChange: function
  reRender: function
  title: string
  resource: ConfigResource | null
}

interface ConfigMod {
  id: number
  label: string
  value: string
}

export { ConfigProps, ConfigMod }
