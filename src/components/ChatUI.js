
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative, { KeyboardAvoidingView, ScrollView } from 'react-native';

import { View, Title, Screen } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Messages from '../containers/Messages';
import Input from '../containers/Input';
import { sendMessage } from '../actions';

const mapStateToProps = (state) => ({
    chatHeight: state.chatroom.meta.height,
    user: state.user
});

class ChatUI extends Component {
    state = {
        scrollViewHeight: 0,
        inputHeight: 0
    }
  

    sendMessage = (text) => {
        return sendMessage(text, this.props.user)
    }

    render() {
        return (
            <Screen>
               <View styleName="h-center" style={{paddingTop: 30,paddingBottom: 30,display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                  <Title style={{ alignItems: 'center', justifyContent:'center'}}>
                     Messenger
                  </Title>
                </View>
                <ScrollView 
                                         onLayout={this.onScrollViewLayout}>
                    <Messages />
                    
                </ScrollView>

                <KeyboardAvoidingView behavior="padding">
                   <View>
                    <Input  onLayout={this.onInputLayout}
                    submitAction={this.sendMessage}
                    ref="input"
                    placeholder="Say something cool ..." />
                   </View>
               </KeyboardAvoidingView>
            </Screen>
        )
    }
}

export default connect(mapStateToProps)(ChatUI);
