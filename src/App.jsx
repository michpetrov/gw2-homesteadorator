import { useState } from 'react'
import * as Prop from './Prop'
import ControlPanel from './ControlPanel.jsx'
import './App.css'

const LB = "\n"

function App() {
  const [xml, setXml] = useState("")

  // TODO: check if string is parseable
  const decs = xml != "" ? xml.split(LB).map(Prop.fromString) : [];
  const setDecs = (decs) => setXml(decs.map(Prop.toString).join(LB))

  return (
    <div className="content">
      <h1>GW2 Homesteadorator</h1>
      <div className="controls">
        <label>Paste decorations here (&lt;prop&gt; elements, not the whole file)
          <textarea id="xml" name="xml" value={xml} onChange={e => setXml(e.target.value)} cols="80" rows="10"/>
        </label>
        <ControlPanel decs={decs} setDecs={setDecs} />
      </div>
    </div>
  )
}

export default App
