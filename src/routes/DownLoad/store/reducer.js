import { constants } from './index'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  appDownLoad: null,
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case constants.APPDOWNLOAD:
  
      return state.set('appDownLoad', action.data)
    default:
      return state
  }
}