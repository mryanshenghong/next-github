import { createStore ,applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import reducer from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'


// const store = createStore(reducer,composeWithDevTools(applyMiddleware(reduxThunk)))

//test

// store.dispatch({type:actions.ADD})
// //subscribe 方法 当数据发生变化就会调用这个方法
// store.subscribe( () => {
//     console.log(`asdasdsd`,store.getState())
// })
// store.dispatch({type:actions.ADD})
//test end
export default function initializeStore(state){
    const store = createStore(
        reducer,
        Object.assign({},state),
        composeWithDevTools(applyMiddleware(reduxThunk))
    )

    return store
}