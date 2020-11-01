const initialState = {
    isLogin : false,
    error: '',
    user: {},
}


const dataReducer = (state = initialState, action)=>{
    switch (action.type) {
        case 'LOGIN_SUKSES':
            return {
                ...state,
                isLogin : true,
            };
        case 'LOGOUT_SUKSES':
            return {
                ...state,
                isLogin : false,
            };
        case 'ERROR':
            return {
                ...state,
                error:action.value
            }
        case 'UPDATE_USER':
            return {
                ...state,
                user:action.value
            }
        default:
            return state;
    }
}

export default dataReducer;