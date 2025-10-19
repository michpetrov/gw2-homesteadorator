const printNumber = (n) => n.toFixed(6);
const printNumberArray = (arr) => arr.map(printNumber).join(" ")

const propRegex = /<prop (id)="(.+)" (name)="(.+)" (pos)="(.+)" (rot)="(.+)" (scl)="(.+)" \/>/i

const trueAngle = (angle) => (Math.round(512*angle/Math.PI)/512)*Math.PI

export const emptyProp = () => fromString(`<prop id="" name="" pos="0.000000 0.000000 0.000000" rot="0.000000 0.000000 0.000000" scl="1.000000" />`)

export const fromString = (prop) => {
  let obj = {}
  let match = prop.match(propRegex)

  obj[match[1]] = match[2]                                                         // id
  obj[match[3]] = match[4]                                                         // name
  obj[match[5]] = match[6].split(" ").map(Number.parseFloat)                       // pos
  obj[match[7]] = match[8].split(" ").map(s => trueAngle(Number.parseFloat(s)))    // rot
  obj[match[9]] = Number.parseFloat(match[10])                                     // scl

  return obj
}

export const toString = ({id, name, pos, rot, scl}) => 
    `<prop id="${id}" name="${name}" pos="${printNumberArray(pos)}" rot="${printNumberArray(rot)}" scl="${printNumber(scl)}" />`
