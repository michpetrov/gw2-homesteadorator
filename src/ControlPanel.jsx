import { useState } from 'react'
import ToolControlContext from './ToolControlContext.jsx'
import FullControl from './FullControl.jsx'
import Mover from './Mover.jsx'

const tools = {
  'full-control': <FullControl/>,
  'mover': <Mover/>
}

const name = (n) => {
  let nParts = n.split('-').map(e => e.charAt(0).toUpperCase() + e.slice(1))
  return nParts.join(' ')
}

export default (state) => {
  const [tool, setTool] = useState('mover')

  let options = []
  Object.keys(tools).forEach((o,i) => {
    options.push(<option key={i} value={o}>{name(o)}</option>)
  })

  return (
    <div id="control-panel">
      <select id="tool-select" value={tool} onChange={e => setTool(e.target.value)}>
        {options}
      </select>
      <ToolControlContext value={{...state}}>
        {state.decs.length != 0 && tools[tool]}
      </ToolControlContext>
    </div>
  )
}