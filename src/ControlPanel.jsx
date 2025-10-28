import { useState } from 'react'
import ToolControlContext from './ToolControlContext.jsx'
import Hint from './Hint.jsx'
import FullControl from './tools/FullControl.jsx'
import Mover from './tools/Mover.jsx'
import CircleGenerator from './tools/CircleGenerator.jsx'
import Randomizer from './tools/Randomizer.jsx'

const tools = {
  'mover': <Mover/>,
  'circle-generator': <CircleGenerator/>,
  'randomizer': <Randomizer/>,
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
      <Hint toolName={tool}/>
      <div className={`tool-control ${tool}`}>
        <ToolControlContext value={{...state}}>
          {state.decs.length != 0 && tools[tool]}
        </ToolControlContext>
      </div>
    </>
  )
}