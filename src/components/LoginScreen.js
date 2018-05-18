
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative,{StyleSheet,ActivityIndicator, TextInput, View} from 'react-native';
import { Screen, Title, Text, Divider, Button, Spinner } from '@shoutem/ui';

import Input from '../containers/Input';
import LoginButton from '../containers/LoginButton';
import { setUserName, setUserAvatar,loginWithEmail,setUserPassword, LoginWithFacebook } from '../actions';

 
const mapStateToProps = (state) => {
  console.log(state); 
  return {
    authorizing: state.user.authorizing,
    name:state.user.name,
    password:state.user.password,
    error:state.user.error
    }
};
 

class LoginScreen extends Component {
  

    render() {
        return (
            <View style={styles.container}>
            <TextInput style={styles.input}
              placeholder='Enter your email...'
              label='Email'
              onChangeText={name => this.props.dispatch( setUserName(name))}
              value={this.props.name}
            />
            <TextInput style={styles.input}
              placeholder='Enter your password...'
              label='Password'
              secureTextEntry
              onChangeText={password => this.props.dispatch(setUserPassword(password))}
              value={this.props.password}
            />
    
             <ActivityIndicator animating={this.props.authorizing} />
            <Button onPress={() =>  this.props.dispatch(loginWithEmail())}>
            <Text>Login</Text>
            </Button>
            <Text>{this.props.error}</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 10
    },
    input: {
      padding: 10,
      color: '#333',
      fontSize: 18,
      width: '100%',
    },
    form: {
      flex: 1
    }
  });
  
export default connect(mapStateToProps)(LoginScreen);
