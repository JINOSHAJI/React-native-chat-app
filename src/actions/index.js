
import firebase from '../firebase';
import DeviceInfo from 'react-native-device-info';
import FCM, { FCMEvent, NotificationType, WillPresentNotificationResult, RemoteNotificationResult } from 'react-native-fcm';
import { Platform } from 'react-native';
import { Permissions, Notifications } from 'expo';

export const addMessage = (msg) => ({
    type: 'ADD_MESSAGE',
    ...msg
});

export const sendMessage = (text, user) => {
    return function (dispatch) {
        let msg = {
                text: text,
                time: Date.now(),
                author: {
                    name: user.name,
                    avatar: user.avatar
                },
            };

        const newMsgRef = firebase.database()
                                  .ref('messages')
                                  .push();
        msg.id = newMsgRef.key;
        newMsgRef.set(msg);

        dispatch(addMessage(msg));
    };
};

export const startFetchingMessages = () => ({
    type: 'START_FETCHING_MESSAGES'
});

export const receivedMessages = () => ({
    type: 'RECEIVED_MESSAGES',
    receivedAt: Date.now()
});

export const fetchMessages = () => {
    return function (dispatch) {
        dispatch(startFetchingMessages());
        firebase.database()
                .ref('messages')
                .orderByKey()
                .limitToLast(20)
                .on('value', (snapshot) => {
                    // gets around Redux panicking about actions in reducers
                    setTimeout(() => {
                        const messages = snapshot.val() || [];

                        dispatch(receiveMessages(messages))
                    }, 0);
                });
    }
}

export const receiveMessages = (messages) => {
    return function (dispatch) {
        Object.values(messages).forEach(msg => dispatch(addMessage(msg)));

        dispatch(receivedMessages());
    }
}

export const updateMessagesHeight = (event) => {
    const layout = event.nativeEvent.layout;

    return {
        type: 'UPDATE_MESSAGES_HEIGHT',
        height: layout.height
    }
}



//
// User actions
//

export const setUserName = (name) => ({
    type: 'SET_USER_NAME',
    name:name
});
export const setoUser = (toUser) => ({
    type: 'SET_TO_USER',
    toUser:toUser
});
 
export const setError = (error) => ({
    type: 'SET_ERROR',
    error:error
});


export const setUserPassword = (password) => ({
    type: 'SET_USER_PASSWORD',
    password:password
});

export const setUserAvatar = (avatar) => ({
    type: 'SET_USER_AVATAR',
    avatar: avatar && avatar.length > 0 ? avatar : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_3_400x400.png'
});
 
export const loginWithEmail = () => {
   
    
    // dispatch(setUserName(name));
    // dispatch(setUserPassword(password));

    return function (dispatch, getState) {
        dispatch(startAuthorizing());
        dispatch( setoUser('jinoshaji1@gmail.com'));

        const { name, avatar,password } = getState().user;
       
        if (name=='') {
            setError("Please enter a valid email id");
            alert("Please enter a valid email id")
            return;
          }

         if (password.length < 6) {
            alert("Please enter atleast 6 characters as password")
            return;
          }
          dispatch(userNoExist());

    console.log('login '+ name);
        
        firebase.auth().signInWithEmailAndPassword(name, password)
      .then((user) => {
         

        console.log('dev'+Expo.Constants.deviceId);
        firebase.database()
                .ref(`users/${Expo.Constants.deviceId}`)
                .set({
                    name,
                    avatar,
                  password
                });
            startChatting(dispatch);
                
 
    })
      .catch(() => {
        dispatch(startAuthorizing());
          
        // Login was not successful
        firebase.auth().createUserWithEmailAndPassword(name, password)
          .then(user => {
            const { name, avatar,password } = getState().user;
            console.log('dev'+Expo.Constants.deviceId);

            firebase.database()
                    .ref(`users/${Expo.Constants.deviceId}`)
                    .set({
                        name,
                        avatar,
                        password
                    });

            startChatting(dispatch);
          }
        )
          .catch(err => {
              console.log(err);
              
              setError(err)
          }
        )
      })
    }
};
 

export const checkUserExists = () => {
    console.log('checkUserExists');
    
    return function (dispatch) {
        dispatch(startAuthorizing());

        firebase.auth()
                .signInAnonymously()
                .then(() => firebase.database()
                                    .ref(`users/${DeviceInfo.getUniqueID()}`)
                                    .once('value', (snapshot) => {
                                        const val = snapshot.val();
                                        console.log('val');
                                        console.log(val);
                                        if (val === null) {
                                            dispatch(userNoExist());
                                        }else{
                                            dispatch(setUserName(val.name));
                                            dispatch(setUserAvatar(val.avatar));
                                            startChatting(dispatch);
                                        }
                                    }))
                .catch(err => {
                    dispatch(userNoExist());
                    setError(err);
                    console.log(err)
                }
          )
    }
}

const startChatting =async function (dispatch) {
    dispatch(userAuthorized());
    dispatch(fetchMessages());
    

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
    
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
    
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }
    
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
    
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      return fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: {
            value: token,
          },
          user: {
            username: 'Brent',
          },
        }),
      });

    // FCM.requestPermissions();
    // FCM.getFCMToken()
    //    .then(token => {
    //        console.log(token)
    //    });
    // FCM.subscribeToTopic('secret-chatroom');

    // FCM.on(FCMEvent.Notification, async (notif) => {
    //     console.log(notif);

    //     if (Platform.OS === 'android') {
    //         switch (notif._notificationType) {
    //             case NotificationType.Remote:
    //                 notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
    //                 break;
    //             case NotificationType.NotificationResponse:
    //                 notif.finish();
    //                 break;
    //             case NotificationType.WillPresent:
    //                 notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
    //                 break;
    //           }
    //         }
    // });

    // FCM.on(FCMEvent.RefreshToken, token => {
    //     console.log(token);
    // });
}

export const startAuthorizing = () => ({
    type: 'USER_START_AUTHORIZING'
});

export const userAuthorized = () => ({
    type: 'USER_AUTHORIZED'
});

export const userNoExist = () => ({
    type: 'USER_NO_EXIST'
});
