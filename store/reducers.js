import { combineReducers } from 'redux'
import { reducer as testReducer } from './testReducer'
import { reducer as userReducer } from './user'

const  reducer = combineReducers({
	test:testReducer,
	user: userReducer
});

export default reducer;