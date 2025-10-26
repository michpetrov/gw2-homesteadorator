import { useState, useContext } from 'react'
import ToolControlContext from '../ToolControlContext.jsx'
import * as HMath from '../HomesteadMath'
import { CheckBoxList, RangeGroup, RangeInput, DataList } from '../Controls.jsx'
import './css/full-control.css'


export default () => {
  const {decs, setDecs} = useContext(ToolControlContext)
  const [selected, setSelected] = useState(new Array(decs.length).fill(false))

  // TODO: check if string is parseable
  const selectedDecs = decs.filter((e,i) => selected[i])

  let rotation = [0,0,0]
  let position = [0,0,0]
  let centroid = [0,0,0]
  let scale = 0

  if (selectedDecs.length > 1) {
    // calculate centroid
    selectedDecs.forEach(el => {
      centroid = HMath.addTuple(centroid, el.pos)
    })
    centroid = centroid.map(p => (p/selectedDecs.length))
  }

  // TODO: don't change value if we hit max/min and inform user
  const processTriple = (valueConverter, attr, getDeltaAgainst, correctionFn) => {
    return (values) => {
      values = valueConverter.toXMLValue(values)
      if (selectedDecs.length === 1) {
        selectedDecs[0][attr] = values
      // TODO I should be getting back the delta instead
      } else if (selectedDecs.length > 1) {
        let delta = HMath.delta(values, getDeltaAgainst())
        selectedDecs.forEach(el => {
          el[attr] = HMath.addTuple(el[attr], delta)
          if (correctionFn) correctionFn(el[attr]);
        })
      }
      setDecs(decs)
    }
  }

  const rotPivotFn = () => selectedDecs[0].rot;
  const setRotation = processTriple(HMath.angleConverter, 'rot', rotPivotFn, (rot) => {
    for (let i = 0; i < rot.length; i++) {
      rot[i] = HMath.correctAngle(rot[i])
    }
  });

  const posPivotFn = () => centroid;
  const setPosition = processTriple(HMath.distConverter, 'pos', posPivotFn, null);

  if (selectedDecs.length >= 1) {
    let rotValue = (selectedDecs.length > 1) ? rotPivotFn() : selectedDecs[0].rot
    let posValue = (selectedDecs.length > 1) ? posPivotFn() : selectedDecs[0].pos
    let sclValue = selectedDecs[0].scl

    rotation = HMath.angleConverter.fromXMLValue(rotValue)
    position = HMath.distConverter.fromXMLValue(posValue)
    scale    = HMath.scaleConverter.fromXMLValue(sclValue)
  }

  const rotLabelFn = (val) => `${(180*val/512).toFixed(2)}°`
  const posLabelFn = (val) => `${(val*HMath.distRatio).toFixed(2)}`
  const sclLabelFn = (val) => `${(val*HMath.scaleRatio).toFixed(2)}`

  const rotOpts = {
    name: 'rot',
    ticks: [0, 256, 512, 768],
    axes: ['x', 'y', 'z'],
    min: 0,
    max: 1023
  }

  const posOpts = {
    name: 'pos',
    ticks: [-6000, -4000, -2000, 0, 2000, 4000, 6000],
    axes: ['x', 'y', 'z'],
    min: -8000,
    max: 8000
  }

  // TODO: maybe 0.5-1 should behave same as 1-2; [-1,1] with more sophisticated converter?
  const sclOpts = {
    name: 'scl',
    ticks: [50, 75, 100, 125, 150, 175, 200],
    min: 50,
    max: 200
  }

  const setScale = (value) => {
    let attr = "scl"
    value = HMath.scaleConverter.toXMLValue(value)
    if (selectedDecs.length === 1) {
      selectedDecs[0][attr] = value
    // TODO I should be getting back the delta instead
    } else if (selectedDecs.length > 1) {
      let delta = value / selectedDecs[0][attr]
      selectedDecs.forEach(el => {
        el[attr] *= delta
      })
    }
    setDecs(decs)
  }

  return (
    <>
      <CheckBoxList decs={decs} selected={selected} setSelected={setSelected} />
      <RangeGroup {...posOpts} values={position} returnValues={setPosition} labelFn={posLabelFn} />
      <RangeGroup {...rotOpts} values={rotation} returnValues={setRotation} labelFn={rotLabelFn} />
      <RangeInput axis="Scale" value={scale} index={0} onChange={setScale} list="scale-ticks" labelFn={sclLabelFn} {...sclOpts} />
      <DataList datalistId="scale-ticks" ticks={sclOpts.ticks} />
    </>
  )

}