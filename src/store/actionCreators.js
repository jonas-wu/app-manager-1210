import * as constants from './constants'

export const logout = () => {
  return (dispatch) => {
    dispatch({
      type: constants.LOGOUT,
      data: null
    })
  }
}