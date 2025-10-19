import { useState } from 'react'
import ToolControlContext from './ToolControlContext.jsx'
import FullControl from './tools/FullControl.jsx'
import Mover from './tools/Mover.jsx'

const tools = {
  'mover': <Mover/>,
  'full-control': <FullControl/>
}

const name = (n) => {
  let nParts = n.split('-').map(e => e.charAt(0).toUpperCase() + e.slice(1))
  return nParts.join(' ')
}

export default (state) => {
  const [tool, setTool] = useState('mover')

  let options = []
  Object.keys(tools).forEach((o,i) => {
    options.push(<li key={i}><button onClick={e => setTool(o)} className={o === tool ? 'active' : ''}>{name(o)}</button></li>)
  })

  return (
    <>
      <div>
        <span className="label">Select tool</span>
        <menu id="tool-select">
          {options}
        </menu>
      </div>
      <div className={`tool-control ${tool}`}>
        <ToolControlContext value={{...state}}>
          {state.decs.length != 0 && tools[tool]}
        </ToolControlContext>
      </div>
    </>
  )
}