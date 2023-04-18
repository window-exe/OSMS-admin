import * as actionTypes from './actionTypes'


const defaultState = {
  login: false,
  role: "",
  cart: 0,
  load: false,
  refresh: 0,
  product: [],
  profile: []

}

const reducer = (state = defaultState, action) => {
  const newState = JSON.parse(JSON.stringify(state))

  switch (action.type) {

    case actionTypes.LOGIN:
      newState.login = action.data
      return newState

    case actionTypes.LOGOUT:
      newState.login = action.data
      return newState

    case actionTypes.MYROLE:
      newState.role = action.data
      return newState

    case actionTypes.MYCart:
      newState.cart = action.data
      return newState

    case actionTypes.LOAD:
      newState.load = action.data
      return newState

    case actionTypes.REFRESH:
      newState.refresh = action.data + 1
      return newState

    case actionTypes.PRODUCT:
      newState.product = action.data
      return newState

    case actionTypes.PROFILE:
      newState.profile = action.data
      return newState
  
      default:
  }
  return state;


}

export default reducer;