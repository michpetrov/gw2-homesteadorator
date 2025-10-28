import { useState } from 'react'

const hintsDB = {
  "mover": (
    <>
      <p>This one requires a bit of work on your part. Get the layout of the decorations you want to move. Then move one of those decoration to the desired place and save as new layout.
      Paste the decorations into the large textarea, paste the one moved decoration in the small textarea. Click the button. The decoration will move to match the position and rotation.
      Note that the tool finds the old decoration by taking the first decoration with matching ID, if you have multiples of the same decoration you might have to rearrange them.
      </p>
    </>
  )
}


const HintText = ({toolName}) => {
  const hintJSX = hintsDB[toolName]

  if (!hintJSX) {
    return <span>Wrong toolname or hint does not exist for this tool yet</span>
  }

  return hintJSX
}

export default (props) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className={`${collapsed ? "collapsed" : ""} hint`}>
      <button className="toggle" onClick={e => setCollapsed(!collapsed)}>?</button>
      <div>
        <HintText {...props} />
      </div>
    </div>
  )
}