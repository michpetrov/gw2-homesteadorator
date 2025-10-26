import { useState, useContext } from 'react'
import ToolControlContext from '../ToolControlContext.jsx'
import * as Prop from '../Prop'
import * as HMath from '../HomesteadMath'
import './css/randomizer.css'

export default () => {
  const {decs, setDecs} = useContext(ToolControlContext)
  const hs = HMath.getHomestead('Janthir')

  const dflt = {
    posx: [true, ...hs.x],
    posy: [true, ...hs.y],
    posz: [true, ...hs.z],
    rotx: [true, ...HMath.angleRange],
    roty: [true, ...HMath.angleRange],
    rotz: [true, ...HMath.angleRange],
    scl:  [true, ...HMath.scaleRange]
  }

  const [rndProps, setRndProps] = useState(dflt)

  const randomBetween = (a, b) => {
    let [min, max] = [a,b].map(Number.parseFloat)
    return Math.random() * (max - min) + min
  }

  const { posx, posy, posz, rotx, roty, rotz, scl } = rndProps

  // TODO: group together
  const generate = () => {
    decs.forEach((d) => {
      if (posx[0]) d.pos[0] = randomBetween(posx[1],posx[2])
      if (posy[0]) d.pos[1] = randomBetween(posy[1],posy[2])
      if (posz[0]) d.pos[2] = randomBetween(posz[1],posz[2])

      if (rotx[0]) d.rot[0] = HMath.trueAngle(HMath.toRads(randomBetween(rotx[1], rotx[2])))
      if (roty[0]) d.rot[1] = HMath.trueAngle(HMath.toRads(randomBetween(roty[1], roty[2])))
      if (rotz[0]) d.rot[2] = HMath.trueAngle(HMath.toRads(randomBetween(rotz[1], rotz[2])))

      if (scl) d.scl = randomBetween(scl[1]/100,scl[2]/100)
    })
    setDecs(decs)
  }

  const setVar = (name, i, value) => {
    rndProps[name][i] = value
    setRndProps({...rndProps, [name]: rndProps[name]})
  }

  const setScl = (i, value) => {
    setVar('scl', i, value)
  }

  const posStep = HMath.posStep
  const sclStep = HMath.sclStep

  /*
  const makePos = (axis) => {
    let x = axis.toUppperCase()
    let full = `pos ${x}`
    return (
      <>
        <label>{`Pos ${x}`}<input type="checkbox" id="rnd-posx" name="rnd-posx" checked={posx[0]} onChange={e => setVar('posx', 0, !posx[0])} /></label>
        <label>X min<br/><input type="number" id="rnd-posxmin" name="rnd-posxmin" value={posx[1]} min={dflt.posx[1]} max={posx[2]} step={posStep} onChange={e => setVar('posx', 1, e.target.value)} readOnly={!posx[0]} /></label>
        <label>X max<br/><input type="number" id="rnd-posxmax" name="rnd-posxmax" value={posx[2]} min={posx[1]} max={dflt.posx[2]} step={posStep} onChange={e => setVar('posx', 2, e.target.value)} readOnly={!posx[0]} /></label>
      </>
    )
  }*/

  // TODO: turn into reusable components
  return (
    <>
      <label>Pos X<input type="checkbox" id="rnd-posx" name="rnd-posx" checked={posx[0]} onChange={e => setVar('posx', 0, !posx[0])} className="x-axis"/></label>
      <label>X min<br/><input type="number" id="rnd-posxmin" name="rnd-posxmin" value={posx[1]} min={dflt.posx[1]} max={posx[2]} step={posStep} onChange={e => setVar('posx', 1, e.target.value)} readOnly={!posx[0]} className="x-axis"/></label>
      <label>X max<br/><input type="number" id="rnd-posxmax" name="rnd-posxmax" value={posx[2]} min={posx[1]} max={dflt.posx[2]} step={posStep} onChange={e => setVar('posx', 2, e.target.value)} readOnly={!posx[0]} className="x-axis"/></label>
      <label>Pos Y<input type="checkbox" id="rnd-posy" name="rnd-posy" checked={posy[0]} onChange={e => setVar('posy', 0, !posy[0])} className="y-axis"/></label>
      <label>Y min<br/><input type="number" id="rnd-posymin" name="rnd-posymin" value={posy[1]} min={dflt.posy[1]} max={posy[2]} step={posStep} onChange={e => setVar('posy', 1, e.target.value)} readOnly={!posy[0]} className="y-axis"/></label>
      <label>Y max<br/><input type="number" id="rnd-posymax" name="rnd-posymax" value={posy[2]} min={posy[1]} max={dflt.posy[2]} step={posStep} onChange={e => setVar('posy', 2, e.target.value)} readOnly={!posy[0]} className="y-axis"/></label>
      <label>Pos Z<input type="checkbox" id="rnd-posz" name="rnd-posz" checked={posz[0]} onChange={e => setVar('posz', 0, !posz[0])} className="z-axis"/></label>
      <label>Z min<br/><input type="number" id="rnd-poszmin" name="rnd-poszmin" value={posz[1]} min={dflt.posz[1]} max={posz[2]} step={posStep} onChange={e => setVar('posz', 1, e.target.value)} readOnly={!posz[0]} className="z-axis"/></label>
      <label>Z max<br/><input type="number" id="rnd-poszmax" name="rnd-poszmax" value={posz[2]} min={posz[1]} max={dflt.posz[2]} step={posStep} onChange={e => setVar('posz', 2, e.target.value)} readOnly={!posz[0]} className="z-axis"/></label>
      <label>Rot X<input type="checkbox" id="rnd-rotx" name="rnd-rotx" checked={rotx[0]} onChange={e => setVar('rotx', 0, !rotx[0])} className="x-axis"/></label>
      <label>X min<input type="number" id="rnd-rotxmin" name="rnd-rotxmin" value={rotx[1]} min={dflt.rotx[1]} max={rotx[2]} onChange={e => setVar('rotx', 1, e.target.value)} readOnly={!rotx[0]} className="x-axis"/></label>
      <label>X max<input type="number" id="rnd-rotxmax" name="rnd-rotxmax" value={rotx[2]} min={rotx[1]} max={dflt.rotx[2]} onChange={e => setVar('rotx', 2, e.target.value)} readOnly={!rotx[0]} className="x-axis"/></label>
      <label>Rot Y<input type="checkbox" id="rnd-roty" name="rnd-roty" checked={roty[0]} onChange={e => setVar('roty', 0, !roty[0])} className="y-axis"/></label>
      <label>Y min<input type="number" id="rnd-rotymin" name="rnd-rotymin" value={roty[1]} min={dflt.roty[1]} max={roty[2]} onChange={e => setVar('roty', 1, e.target.value)} readOnly={!roty[0]} className="y-axis"/></label>
      <label>Y max<input type="number" id="rnd-rotymax" name="rnd-rotymax" value={roty[2]} min={roty[1]} max={dflt.roty[2]} onChange={e => setVar('roty', 2, e.target.value)} readOnly={!roty[0]} className="y-axis"/></label>
      <label>Rot Z<input type="checkbox" id="rnd-rotz" name="rnd-rotz" checked={rotz[0]} onChange={e => setVar('rotz', 0, !rotz[0])} className="z-axis"/></label>
      <label>Z min<input type="number" id="rnd-rotzmin" name="rnd-rotzmin" value={rotz[1]} min={dflt.rotz[1]} max={rotz[2]} onChange={e => setVar('rotz', 1, e.target.value)} readOnly={!rotz[0]} className="z-axis"/></label>
      <label>Z max<input type="number" id="rnd-rotzmax" name="rnd-rotzmax" value={rotz[2]} min={rotz[1]} max={dflt.rotz[2]} onChange={e => setVar('rotz', 2, e.target.value)} readOnly={!rotz[0]} className="z-axis"/></label>
      <label>Scl<input type="checkbox" id="rnd-scl" name="rnd-scl" checked={scl[0]} onChange={e => setScl(0, !scl[0])} /></label>
      <label>Min<input type="number" id="rnd-sclmin" name="rnd-sclmin" value={scl[1]} min={dflt.scl[1]} max={scl[2]} step={sclStep} onChange={e => setScl(1, e.target.value)} readOnly={!scl[0]} /></label>
      <label>Max<input type="number" id="rnd-sclmax" name="rnd-sclmax" value={scl[2]} min={scl[1]} max={dflt.scl[2]} step={sclStep} onChange={e => setScl(2, e.target.value)} readOnly={!scl[0]} /></label>
      <button id="rnd-generate-button" onClick={e => generate()}>Generate</button>
    </>
  )
}