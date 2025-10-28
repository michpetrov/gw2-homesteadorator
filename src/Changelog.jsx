import { Fragment } from 'react'
import changelog from './changelog.json'

export default () => {

  const changes = []
  let keys = Object.keys(changelog.changes)
  keys.forEach((ch,i) => {
    let item = changelog.changes[ch]
    let key = `chng${keys.length - i}`
    changes.push(<Fragment key={key}><h3>{ch}</h3><p>{item}</p></Fragment>)
  })

  const plans = []
  changelog.plans.forEach((p,i) => plans.push(<li key={`plan${i}`}>{p}</li>))

  return (
    <div className="changelog-plans">
      <div className="changelog">
        {changes}
      </div>
      <div className="plans">
        <ul>
          {plans}
        </ul>
      </div>
    </div>
  )
}