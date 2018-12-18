import { constants } from './index'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  showSiderNav: true,
  appListInfo: null,
})

export default (state = defaultState, action) => {
  switch(action.type) {

    case constants.TOGGLE_SIDER_NAV:
      return state.set('showSiderNav', action.show)

    case constants.GET_APP_LIST:
    return state.set('appListInfo', action.data)

    default:
      return state
  }
}