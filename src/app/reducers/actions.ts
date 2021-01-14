import { createAction, props } from '@ngrx/store'
import { typeUser } from '../models/types'

export const setUser = createAction('[SetUser Component] SetUser', props<{userData:typeUser}>())
