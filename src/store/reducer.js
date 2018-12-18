import { combineReducers } from 'redux-immutable'
import { reducer as homeReducer}  from '../routes/Home/store'
import { reducer as appDetailReducer}  from '../routes/app/store'
import { reducer as accountReducer}  from '../routes/Account/store'
import { reducer as appDownLoadReducer}  from '../routes/DownLoad/store'
import * as constants from './constants'

const appReducer= combineReducers({
  home: homeReducer,
  app: appDetailReducer,
  account: accountReducer,
  appDownLoad: appDownLoadReducer,
})

const reducer = (state, action) => {
  if (action.type === constants.LOGOUT) {
    state = undefined
  }
  return appReducer(state, action)
}

export default reducer