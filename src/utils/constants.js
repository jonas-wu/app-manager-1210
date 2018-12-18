const DEBUG = false
export const SERVER = (DEBUG ? '':'')
export const API_BASE_URL = (DEBUG ? 'http://10.112.18.32:8080' : ''+SERVER)

export const ERR_CODE_SUCCESS = 0
export const ERR_CODE_NOT_LOGIN = -1