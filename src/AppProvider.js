
import React, { Component } from 'react';

import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {StyleSheet} from 'react-native';
import ChatUI from './components/ChatUI';
import LoginScreen from './components/LoginScreen';
import rootReducer from './reducers';
import { fetchMessages, checkUserExists } from './actions';


const loggerMiddleware = createLogger();

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        //loggerMiddleware
    )
);

import { Examples } from '@shoutem/ui';

const LoginOrChat = connect(
    (state) => ({
        authorized: state.user.authorized
    })
)(({ authorized, dispatch }) => {
    if (authorized) {
        return (<ChatUI />);
    }else{
        dispatch(checkUserExists());
        return (<LoginScreen />);
    }
});

class AppProvider extends Component {
    render() {
        return (
            <Provider styles={styles.container} store={store}>
               <LoginOrChat styles={styles.container} />
            </Provider>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
       paddingTop: 50,
      }
    });
export default AppProvider;
