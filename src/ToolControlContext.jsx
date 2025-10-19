import { createContext } from 'react';

const defaultContext = {
  decs: [],
  setDecs: () => {}
}

const ToolControlContext = createContext(defaultContext)

export default ToolControlContext