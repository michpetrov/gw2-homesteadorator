import { useState } from 'react'
import * as Prop from './Prop'
import * as HMath from './HomesteadMath'
import './App.css'

const LB = "\n"

const shortenName = (name) => {
  let parts = name.split(" ")
  return parts.map((el, i) => {
    if (i === parts.length - 1) return el
    return el[0] + "."
  }).join(" ")
}

const CheckBoxRow = ({index, id, name, checked, onChange}) => {
  const setSelection = () => onChange(index)

  return (
    <label>
      <input type="checkbox" value={index} id={id} name={id} checked={checked} onChange={setSelection} />
      {name}
    </label>
  )
}

const CheckBoxList = ({decorations, selected, setSelected}) => {
  const onChange = (index) => {
    let newSelection = [...selected];
    newSelection[index] = !newSelection[index]
    setSelected(newSelection)
  }

  const setEverything = () => {
    let newSelection = [...selected];
    // select all if at least one false
    setSelected(newSelection.fill(newSelection.includes(false)))
  }

  let list = [];
  decorations.forEach((dec, i) => {
    list.push(<li key={i}><CheckBoxRow index={i} id={`${i}prop`} name={shortenName(dec.name)} checked={selected[i]} onChange={onChange} /></li>)
  })

  return (
    <ul className="checkbox-list">
      <li>
        <label>
          <input type="checkbox" id="all" name="all" checked={!selected.includes(false)} onChange={setEverything} />
          Everything
        </label>
        <ul>
          {list}
        </ul>
      </li>
    </ul>
  )
}

//------------

const RangeInput = ({name, axis, index, onChange, labelFn, value, ...rest}) => {
  const setValue = (e) => onChange(e.target.value, index)

  let fullName = `${axis}-${name}`
  let label = !!labelFn ? labelFn(value) : value

  return (
    <div className="card-child">
      <label htmlFor={fullName}>{`${axis.toUpperCase()}-axis (${label})`}</label>
      <input id={fullName} name={fullName} className={`${axis}-axis`} type="range" value={value} onChange={setValue} {...rest} />
    </div>
  )
}

const DataList = ({datalistId, ticks}) => {

  let tickOptions = [];
  for (let i = 0; i < ticks.length; i++) {
    tickOptions.push(<option key={i} value={ticks[i]} />)
  }

  return (
    <datalist id={datalistId}>
      {tickOptions}
    </datalist>
  )
}

const RangeGroup = ({name, ticks, axes, labelFn, values, returnValues, ...rest}) => {

  const setValueAt = (value, index) => {
    let newValues = [...values]
    newValues[index] = value;
    returnValues(newValues);
  }

  let datalistId = `${name}-ticks`

  let rangeControls = [];
  for (let i = 0; i < values.length; i++) {
    rangeControls.push(<RangeInput key={i} axis={axes[i]} value={values[i]} index={i} onChange={setValueAt} list={datalistId} labelFn={labelFn} name={name} {...rest}/>)
  }

  return (
    <>
      {rangeControls}
      <DataList datalistId={datalistId} ticks={ticks} />
    </>
  )
}

function App() {
  const [selected, setSelected] = useState([])
  const [text, setText] = useState("")

  const angleRatio = Math.PI/512
  const distRatio = 100/97
  const scaleRatio = 1/100

  const angleConverter = HMath.createConverter(angleRatio)
  const distConverter = HMath.createConverter(distRatio)
  const correctAngle = (value, mod) => (value + mod) % mod
  const scaleConverter = HMath.createSimpleConverter(scaleRatio)

  // TODO: check if string is parseable
  const decorations = text != "" ? text.split(LB).map(Prop.fromString) : [];
  const selectedDecorations = decorations.filter((e,i) => selected[i])

  let rotation = [0,0,0]
  let position = [0,0,0]
  let centroid = [0,0,0]
  let scale = 0

  if (selectedDecorations.length > 1) {
    // calculate centroid
    selectedDecorations.forEach(el => {
      centroid = HMath.addTuple(centroid, el.pos)
    })
    centroid = centroid.map(p => (p/selectedDecorations.length))
  }

  const processText = (value) => {
    let lines = value.split(LB).length;
    setSelected(new Array(lines).fill(false))
    setText(value);
  }

  // TODO: don't change value if we hit max/min and inform user
  const processTriple = (valueConverter, attr, getDeltaAgainst, correctionFn) => {
    return (values) => {
      values = valueConverter.toXMLValue(values)
      if (selectedDecorations.length === 1) {
        selectedDecorations[0][attr] = values
      // TODO I should be getting back the delta instead
      } else if (selectedDecorations.length > 1) {
        let delta = HMath.delta(values, getDeltaAgainst())
        selectedDecorations.forEach(el => {
          el[attr] = HMath.addTuple(el[attr], delta)
          if (correctionFn) correctionFn(el[attr]);
        })
      }
      setText(decorations.map(Prop.toString).join(LB))
    }
  }

  const rotPivotFn = () => selectedDecorations[0].rot;
  const setRotation = processTriple(angleConverter, 'rot', rotPivotFn, (rot) => {
    for (let i = 0; i < rot.length; i++) {
      rot[i] = correctAngle(rot[i], 2*Math.PI)
    }
  });

  const posPivotFn = () => centroid;
  const setPosition = processTriple(distConverter, 'pos', posPivotFn, null);

  if (selectedDecorations.length === 1) {
    rotation = angleConverter.fromXMLValue(selectedDecorations[0].rot)
    position = distConverter.fromXMLValue(selectedDecorations[0].pos)
    scale = scaleConverter.fromXMLValue(selectedDecorations[0].scl)
  } else if (selectedDecorations.length > 1) {
    rotation = angleConverter.fromXMLValue(rotPivotFn())
    position = distConverter.fromXMLValue(posPivotFn())
    scale = scaleConverter.fromXMLValue(selectedDecorations[0].scl)
  }

  const rotLabelFn = (val) => `${(180*val/512).toFixed(2)}°`
  const posLabelFn = (val) => `${(val*distRatio).toFixed(2)}`
  const sclLabelFn = (val) => `${(val*scaleRatio).toFixed(2)}`

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
      value = scaleConverter.toXMLValue(value)
      if (selectedDecorations.length === 1) {
        selectedDecorations[0][attr] = value
      // TODO I should be getting back the delta instead
      } else if (selectedDecorations.length > 1) {
        let delta = value / selectedDecorations[0][attr]
        selectedDecorations.forEach(el => {
          el[attr] *= delta
        })
      }
      setText(decorations.map(Prop.toString).join(LB))
    }

  return (
    <div className="content">
      <h1>GW2 Homesteadorator</h1>
      <div className="list-text">
        {text && 
          <CheckBoxList decorations={decorations} selected={selected} setSelected={setSelected} />
        }
        <textarea id="props" name="props" value={text} onChange={e => processText(e.target.value)} cols="70" rows="10"/>
      </div>
      {selected.includes(true) &&
        <div className="card">
          <RangeGroup {...posOpts} values={position} returnValues={setPosition} labelFn={posLabelFn} />
          <RangeGroup {...rotOpts} values={rotation} returnValues={setRotation} labelFn={rotLabelFn} />
          <RangeInput axis="Scale" value={scale} index={0} onChange={setScale} list="scale-ticks" labelFn={sclLabelFn} {...sclOpts} />
          <DataList datalistId="scale-ticks" ticks={sclOpts.ticks} />
        </div>
      }
    </div>
  )
}

export default App
