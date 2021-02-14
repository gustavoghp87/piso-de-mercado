import { Action, createReducer, on } from '@ngrx/store'
import { setUser } from './actions'
import { typeUser } from '../models/types'


export let user:typeUser

const _setUserReducer = createReducer(
    user,
    on(setUser, (state:typeUser, action) => {
        if (!action.userData) {
            // console.log("BORRANDO EL USUARIO", action.userData)
            localStorage.setItem('username', '')
            localStorage.setItem('token', '')
            localStorage.setItem('groups', '')
            localStorage.setItem('email', '')
            localStorage.setItem('superAdmin', '')
            localStorage.setItem('groupAdmin', '')
            localStorage.setItem('profileImage', '')
            localStorage.setItem('currentGroup', '')
            localStorage.setItem('currentChannel', '')
            return null
        }
        // console.log("ESTABLECIENDO EL USUARIO", action.userData)
        localStorage.setItem('username', action.userData.username)
        localStorage.setItem('token', action.userData.token)
        localStorage.setItem('groups', JSON.stringify({groups:action.userData.groups}))
        localStorage.setItem('email', action.userData.email)
        localStorage.setItem('superAdmin', action.userData.superAdmin.toString())
        localStorage.setItem('groupAdmin', action.userData.groupAdmin.toString())
        localStorage.setItem('profileImage', action.userData.profileImage)
        if (action.userData.currentGroup) localStorage.setItem('currentGroup', action.userData.currentGroup)
        if (action.userData.currentChannel) localStorage.setItem('currentChannel', action.userData.currentChannel)
        //console.log("Storage:", localStorage.getItem("username"))
        return action.userData
    })
)

export const setUserReducer = (state:typeUser, action:Action) => {
    return _setUserReducer(state, action)
}
