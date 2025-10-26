const homesteads = {
  'Janthir': {
    x: [-8000, 8000], // west-east
    y: [-8000, 8000], // bottom-top
    z: [-8000, 8000]  // south-north
  },
  'Castora': {
    x: [-8000, 8000], // west-east
    y: [-8000, 8000], // bottom-top
    z: [-8000, 8000]  // south-north
  }
}

export const getHomestead = (name) => {
  return homesteads[name]
}

export const angleRange = [0, 1023]
export const scaleRange = [50,200]
export const posStep = 1/16
export const sclStep = 1/16

export const multiplyTuple = (tuple, ratio)  => tuple.map(e => e*ratio)
export const addTuple =      (tuple, delta)  => tuple.map((e,i) => e + delta[i])
export const delta =         (tuple, origin) => tuple.map((e,i) => e - origin[i])


// converter should convert between prop attribute into internal representation
// i.e. for angle the conversion should be between 3.141593 <-> 512 
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

// TODO: rework this
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


// TODO: put this into  converter?
export const toRads = (gwAngle) => gwAngle*Math.PI/512
export const toDegrees = (gwAngle) => gwAngle*180/512
export const radsToGwAngle = (rads) => Math.round(rads*512/Math.PI)

export const angleRatio = Math.PI/512
export const distRatio = 100/97
export const scaleRatio = 1/100

export const angleConverter = createConverter(angleRatio)
export const distConverter = createConverter(distRatio)
export const scaleConverter = createSimpleConverter(scaleRatio)

// TODO also in a converter
// correct value to fall between 0 and ~359 degrees
export const correctAngle = (value) => (value + 2*Math.PI) % (2*Math.PI)
// angle values in a prop (6 decimals) are imprecise, this adds the missing decimals for better precision
export const trueAngle = (angle) => (Math.round(512*angle/Math.PI)/512)*Math.PI

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