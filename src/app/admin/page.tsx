import React from 'react'
import { Snippet } from '@nextui-org/react'

const codeList = [
  'for x=-1600,1600,35 do for y=-1600,1600,35 do ThePlayer.player_classified.MapExplorer:RevealArea(x,0,y) end end',
  'for k,v in pairs(AllPlayers) do v:PushEvent("respawnfromghost") end',
  'c_godmode()',
  'c_godmode(false)',
]

const Admin = () => {
  return (
    <div>
      {codeList.map(code => (
        <Snippet key={code}>{code}</Snippet>
      ))}
    </div>
  )
}

export default Admin
