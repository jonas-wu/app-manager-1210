import { constants } from './index'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  deleteAppName: '',
  appInfo: null,
  appHistory: null,
  publishInfo: null,
  appDetailPageLoading: false,
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case constants.CHANGE_DELETE_APP_NAME:
      return state.set('deleteAppName', action.data)
    case constants.SET_APP_INFO:
      if (action.data) {
        return state.set('appInfo', fromJS(action.data))
      } else {
        return state.set('appInfo', null)
      }
    case constants.SET_APP_HISTORY:
      if (action.data) {
        return state.set('appHistory', fromJS(action.data))
      } else {
        return state.set('appHistory', null)
      }
    case constants.SET_PUBLISH_INFO:
      if (action.data) {
        return state.set('publishInfo', fromJS(action.data))
      } else {
        return state.set('publishInfo', null)
      }
    case constants.SET_APP_DETAIL_PAGE_LOADING:
      return state.set('appDetailPageLoading', action.data)
    default:
      return state
  }
}