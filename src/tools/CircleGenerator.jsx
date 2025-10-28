import { useState, useContext } from 'react'
import ToolControlContext from '../ToolControlContext.jsx'
import * as Prop from '../Prop'
import * as HMath from '../HomesteadMath'
import './css/circle-generator.css'

export default () => {
  const {decs, setDecs} = useContext(ToolControlContext)
  const [circleProps, setCircleProps] = useState({count: decs.length, radius: 100, radiate: false, center: [0,0,0]})

  const {count, radius, radiate, center} = circleProps

  const setCenter = (i, value) => {
    center[i] = value
    setCircleProps({...circleProps, center})
  }

  const generateDecs = (decs, count) => {
    const length = decs.length
    for (let i = length; i < count; i++) {
      decs.push({...decs[i % length]})
    }
  }

  const generate = () => {
    if (count > decs.length) {
      generateDecs(decs, count)
    }

    const angle = 2*Math.PI/count

    // polar coordinates start at [x,0] ("east" side of the circle),
    // we want them to start at [0,x] ("north"), hence the Math.PI/2 quartercircle offset
    decs.forEach((e,i) => {
      let currAngle = HMath.trueAngle(angle*i + Math.PI/2)
      let cent = center.map(Number.parseFloat)
      let r = Number.parseFloat(radius)
      let x = r*Math.cos(currAngle)
      let y = r*Math.sin(currAngle)
      e.pos = HMath.addTuple(cent, [x, y, 0])

      if (radiate) {
        e.rot = [0, 0, currAngle - Math.PI/2]
      }
    })

    setDecs(decs)
  }

  const posStep = HMath.posStep
  const hs = HMath.getHomestead('Janthir')


  // TODO: add orientation picker (x,y,z axis)
  return (
    <>
      <label>Count
        <input type="number" id="cg-count" name="cg-count" min="2" value={count} onChange={e => setCircleProps({...circleProps, count: e.target.value})} />
      </label>
      <label>Radius
        <input type="number" id="cg-radius" name="cg-radius" step={posStep} value={radius} onChange={e => setCircleProps({...circleProps, radius: e.target.value})} />
      </label>
      <label>Radiate
        <input type="checkbox" id="cg-radiate" name="cg-radiate" value={radiate} onChange={e => setCircleProps({...circleProps, radiate: !radiate})} />
      </label>
      <label>Center (X,Y,Z)<br />
        <input type="number" id="cg-x" name="cg-x" step={posStep} min={hs.x[0]} max={hs.x[1]} value={center[0]} onChange={e => setCenter(0, e.target.value)} />
        <input type="number" id="cg-y" name="cg-y" step={posStep} min={hs.y[0]} max={hs.y[1]} value={center[1]} onChange={e => setCenter(1, e.target.value)} />
        <input type="number" id="cg-z" name="cg-z" step={posStep} min={hs.z[0]} max={hs.z[1]} value={center[2]} onChange={e => setCenter(2, e.target.value)} />
      </label>
      <button id="cg-generate-button" onClick={e => generate()}>Generate</button>
    </>
  )
}