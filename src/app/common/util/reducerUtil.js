export const createReducer = (initialState, fnMap) => {
  // similar to default in switch statement, {type, payload} come from actions
  return (state = initialState, {type, payload}) => {
    const handler = fnMap[type];

    return handler ? handler(state, payload): state
  }
}