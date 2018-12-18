import { constants } from './index'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  accountList: null,
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case constants.ACCOUNTLIST:
  
      return state.set('accountList', action.data)
    default:
      return state
  }
}