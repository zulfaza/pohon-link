import dataReducer from './reducers/DataReducer'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';


const store = createStore(dataReducer, applyMiddleware(thunk))

export default store;