import { ConfigResource } from '@/app/resource/resourceType.d'

interface ConfigProps {
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
