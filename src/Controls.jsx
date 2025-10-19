const shortenName = (name) => {
  let parts = name.split(" ")
  return parts.map((el, i) => {
    if (i === parts.length - 1) return el
    return el[0] + "."
  }).join(" ")
}

export const CheckBoxRow = ({index, id, name, checked, onChange}) => {
  const setSelection = () => onChange(index)

  return (
    <label>
      <input type="checkbox" value={index} id={id} name={id} checked={checked} onChange={setSelection} />
      {name}
    </label>
  )
}

export const CheckBoxList = ({decs, selected, setSelected}) => {
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
  decs.forEach((dec, i) => {
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

export const RangeInput = ({name, axis, index, onChange, labelFn, value, ...rest}) => {
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

export const DataList = ({datalistId, ticks}) => {

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

export const RangeGroup = ({name, ticks, axes, labelFn, values, returnValues, ...rest}) => {

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