import { reducer as authReducer } from './sign';

const rootReducer = {
    [authReducer.name]: authReducer.reducer
}

export default rootReducer;