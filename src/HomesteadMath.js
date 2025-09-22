const multiplyTuple = (tuple, ratio) => tuple.map(e => e*ratio)
const addTuple =      (tuple, delta) => tuple.map((e,i) => e + delta[i])

// multiplicative converter, will we need other ones?
export const createConverter = (ratio) => {
  return {
    fromXMLValue: (tuple) => multiplyTuple(tuple, 1/ratio),
    toXMLValue: (tuple) => multiplyTuple(tuple, ratio) 
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