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

const RangeGroup = ({name, ticks, axes, labelFn, values, returnValues, ...rest}) => {

  const setValueAt = (value, index) => {
    let newValues = [...values]
    newValues[index] = value;
    returnValues(newValues);
  }

  let datalistId = `${name}-ticks`
  let tickOptions = [];
  for (let i = 0; i < ticks.length; i++) {
    tickOptions.push(<option key={i} value={ticks[i]} />)
  }

  let rangeControls = [];
  for (let i = 0; i < values.length; i++) {
    rangeControls.push(<RangeInput axis={axes[i]} value={values[i]} index={i} onChange={setValueAt} list={datalistId} labelFn={labelFn} name={name} {...rest}/>)
  }

  return (
    <>
      {rangeControls}
      <datalist id={datalistId}>
        {tickOptions}
      </datalist>
    </>
  )
}

function App() {
  const [selected, setSelected] = useState([])
  const [text, setText] = useState("")

  let angleRatio = Math.PI/512
  let distRatio = 100/97

  const angleConverter = HMath.createConverter(angleRatio);
  const distConverter = HMath.createConverter(distRatio);
  const correctAngle = (value, mod) => (value + mod) % mod

  // TODO: check if string is parseable
  const decorations = text != "" ? text.split(LB).map(Prop.fromString) : [];
  const selectedDecorations = decorations.filter((e,i) => selected[i])

  let rotation = [0,0,0]
  let position = [0,0,0]
  let centroid = [0,0,0]

  if (selectedDecorations.length > 1) {
    // calculate centroid
    selectedDecorations.forEach(el => {
      for (let i = 0; i < position.length; i++) {
        centroid[i] += el.pos[i]
      }
    })
    centroid = centroid.map(p => (p/selectedDecorations.length))
  }

  const processText = (value) => {
    let lines = value.split(LB).length;
    setSelected(new Array(lines).fill(false))
    setText(value);
  }

  // TODO: turn this into math functions and put into a library
  const setRotation = (values) => {
    values = angleConverter.toXMLValue(values)
    if (selectedDecorations.length === 1) {
      selectedDecorations[0].rot = values
    // TODO I should be getting back the delta instead
    } else if (selectedDecorations.length > 1) {
      let delta = [0,0,0]
      values.forEach((e,i) => {
        delta[i] = e - selectedDecorations[0].rot[i]
      })
      selectedDecorations.forEach(el => {
        for (let i = 0; i < el.rot.length; i++) {
          el.rot[i] += delta[i]
          el.rot[i] = correctAngle(el.rot[i], 2*Math.PI)
        }
      })
    }
    setText(decorations.map(Prop.toString).join(LB))
  }

  const setPosition = (values) => {
    values = distConverter.toXMLValue(values)
    if (selectedDecorations.length === 1) {
      selectedDecorations[0].pos = values
    // TODO I should be getting back the delta instead
    } else if (selectedDecorations.length > 1) {
      let delta = [0,0,0]
      values.forEach((e,i) => {
        delta[i] = e - centroid[i]
      })
      selectedDecorations.forEach(el => {
        for (let i = 0; i < el.pos.length; i++) {
          el.pos[i] += delta[i]
        }
      })
    }
    setText(decorations.map(Prop.toString).join(LB))
  }

  if (selectedDecorations.length === 1) {
    rotation = angleConverter.fromXMLValue(selectedDecorations[0].rot)
    position = distConverter.fromXMLValue(selectedDecorations[0].pos)
  } else if (selectedDecorations.length > 1) {
    rotation = angleConverter.fromXMLValue(selectedDecorations[0].rot)
    position = distConverter.fromXMLValue(centroid)
  }

  const rotLabelFn = (val) => `${(180*val/512).toFixed(2)}°`
  const posLabelFn = (val) => `${(val*distRatio).toFixed(2)}`

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
        </div>
      }
    </div>
  )
}

export default App
