
const initialState = {
    name: 'jinoshajiv@gmail.com',
    avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_3_400x400.png',
    password:'123456',
    authorizing: false,
    authorized: false,
    error:''
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_NAME':
        console.log('name '+action.name);
            return Object.assign({}, state, {
                name: action.name
            });
        case 'SET_USER_PASSWORD':
            console.log('passsword '+action.password);
                return Object.assign({}, state, {
                    password:action.password
                });

        case 'SET_ERROR':
                console.log('error '+action.error);
                    return Object.assign({}, state, {
                        error:action.error
                    });
    
                
        case 'SET_USER_AVATAR':
            return Object.assign({}, state, {
                avatar: action.avatar
            });
        case 'USER_START_AUTHORIZING':
            return Object.assign({}, state, {
                authorizing: true
            });
        case 'USER_AUTHORIZED':
        console.log('USER_AUTHORIZED '+action);
            return Object.assign({}, state, {
                authorizing: false,
                authorized: true
            });
        case 'USER_NO_EXIST':
            return Object.assign({}, state, {
                authorizing: false,
                authorized: false
            });

            
        default:
            return state
    }
}

export default user;
