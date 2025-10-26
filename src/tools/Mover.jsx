import { useState, useContext } from 'react'
import ToolControlContext from '../ToolControlContext.jsx'
import * as Prop from '../Prop'
import * as HMath from '../HomesteadMath'

export default () => {
  const {decs, setDecs} = useContext(ToolControlContext)
  const [pivotXML, setPivotXML] = useState("")

  const correctAngle = (value, mod) => (value + mod) % mod

  const pivot = pivotXML != "" ? Prop.fromString(pivotXML) : null

  const moveProps = () => {
    let original
    // TODO: move to pivot onchange, figure out what to do with multiple matches
    for (let i = 0; i < decs.length; i++) {
      if (decs[i].id === pivot.id) {
        original = decs[i]
        break
      }
    }

    let deltaPos = HMath.delta(pivot.pos, original.pos)
    let deltaRot = HMath.delta(pivot.rot, original.rot)

    decs.forEach(el => {
      let relPos = HMath.delta(el.pos, original.pos) // relative position to original
      el.pos = HMath.addTuple(HMath.rotate(relPos, deltaRot), original.pos) // 1. rotate the relative position and shift back
      el.pos = HMath.addTuple(el.pos, deltaPos) // 2. shift the rotated position
      el.rot = HMath.addTuple(el.rot, deltaRot)
      for (let i = 0; i < el.rot.length; i++) {
        el.rot[i] = correctAngle(el.rot[i], 2*Math.PI)
      }
    })

    setDecs(decs)
  }

  return (
    <>
      <div className="two-cols">
        <textarea id="pivot" name="pivot" value={pivotXML} onChange={e => setPivotXML(e.target.value)} cols="70" rows="2"/>
        <button id="move-button" disabled={decs.length == 0 || pivotXML === ""} onClick={e => moveProps()}>Move</button>
      </div>
    </>
  )
}