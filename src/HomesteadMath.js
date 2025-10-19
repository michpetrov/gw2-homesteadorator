// TODO: should this be agnostic or no? probably no

export const multiplyTuple = (tuple, ratio)  => tuple.map(e => e*ratio)
export const addTuple =      (tuple, delta)  => tuple.map((e,i) => e + delta[i])
export const delta =         (tuple, origin) => tuple.map((e,i) => e - origin[i])

// multiplicative converter, will we need other ones?
const createConverter = (ratio) => {
  return {
    fromXMLValue: (tuple) => multiplyTuple(tuple, 1/ratio),
    toXMLValue: (tuple) => multiplyTuple(tuple, ratio) 
  }
}

const createSimpleConverter = (ratio) => {
  return {
    fromXMLValue: (value) => value/ratio,
    toXMLValue: (value) => value*ratio
  }
}

// what will this do, just check?
const positionChecker = (minmax) => { // [ [min1, max1], [m2,m2], ...]
  return {
    // will there be any other function?
    check: (tuple) => {
      tuple.forEach((e,i) => {
        if (e < minmax[i][0] || e > minmax[i][1]) return false
      })
      return true
    }
  }
}

export const angleRatio = Math.PI/512
export const distRatio = 100/97
export const scaleRatio = 1/100

export const angleConverter = createConverter(angleRatio)
export const distConverter = createConverter(distRatio)
export const scaleConverter = createSimpleConverter(scaleRatio)
export const correctAngle = (value) => (value + 2*Math.PI) % (2*Math.PI)

const sinCos = (angle) => {
  return [Math.sin(angle), Math.cos(angle)]
}

export const rotate = ([x,y,z], [a,b,c]) => {
  let [sinA, cosA] = sinCos(a)
  let [sinB, cosB] = sinCos(b)
  let [sinC, cosC] = sinCos(c)

  let xx = (x*cosC - y*sinC)*cosB + z*sinB
  let yy = (y*cosC + x*sinC)*cosA - (z*cosB - (x*cosC - y*sinC)*sinB)*sinA
  let zz = (z*cosB - (x*cosC - y*sinC)*sinB)*cosA + (y*cosC + x*sinC)*sinA

  return [xx, yy, zz]
}

export const rotateGroup = (points, angles, pivot) => {
  return points.map(p => {
    let d = delta(p, pivot)
    let pp = rotate(d, angles)
    return addTuple(pivot, pp)
  })
}