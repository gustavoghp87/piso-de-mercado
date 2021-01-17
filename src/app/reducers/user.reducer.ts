import { Action, createReducer, on } from '@ngrx/store'
import { setUser } from './actions'
import { typeUser } from '../models/types'


export let user:typeUser

const _setUserReducer = createReducer(
    user,
    on(setUser, (state:typeUser, action) => {
        if (!action.userData) return null
        console.log("ESTABLECIENDO EL USUARIO", action.userData)
        localStorage.setItem('groups', JSON.stringify({groups:action.userData.groups}))
        localStorage.setItem('email', action.userData.email)
        localStorage.setItem('superAdmin', action.userData.superAdmin.toString())
        localStorage.setItem('groupAdmin', action.userData.groupAdmin.toString())
        localStorage.setItem('profileImage', action.userData.profileImage)
        if (action.userData.showGroup) localStorage.setItem('showGroup', action.userData.showGroup)
        if (action.userData.currentChannel) localStorage.setItem('currentChannel', action.userData.currentChannel)
        return action.userData
    })
)

export const setUserReducer = (state:typeUser, action:Action) => {
    return _setUserReducer(state, action)
}
