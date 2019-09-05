import * as actions from './testActions'
const initialState = {
    count: 0
}

export  const reducer = (state = initialState, action) =>{
    switch (action.type) {
        case actions.ADD:
            return { count : state.count +1}
        case actions.ADDVALUE:
            return { count : state.count + action.value }
        default:
            return state
    }
}