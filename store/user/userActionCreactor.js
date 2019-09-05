import * as actions from './userActions'
import axios from 'axios'

export const logout = () => {
    return (dispatch) => {
        axios.post('./logout').then( (res) => {
            if(res.status === 200){
                const action = {
                    type: actions.LOGOUT,
                }
                dispatch(action)
            }else{
                console.log("logout failed", res)
            }
        }).catch( (err) => {
            console.log(err)
        })
    }
}