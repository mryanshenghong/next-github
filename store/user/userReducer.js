import * as actions from './userActions'
const initialState = {}

export default (state = initialState, action) =>{
    switch (action.type) {
        case actions.LOGOUT:
            return {}
        default:
            return state
    }
}