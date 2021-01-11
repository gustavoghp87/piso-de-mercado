import { createReducer, on } from '@ngrx/store'
import { changeLogged } from './log-actions'
 
export const logged:boolean = false

const _loggedReducer = createReducer(
    logged,
    on(changeLogged, (state) => {console.log(state); return !state})
)
 
export const loggedReducer = (state, action) => {
    console.log(state)
    return _loggedReducer(state, action)
}
