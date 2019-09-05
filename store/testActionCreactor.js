import * as actions from './testActions'

export const addValueCreator = (value) => {
    return (dispatch) => {
        const action = {
            type: actions.ADDVALUE,
            value:value
        }
        dispatch(action)
    }
}