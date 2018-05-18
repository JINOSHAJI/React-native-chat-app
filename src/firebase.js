
import * as firebase from 'firebase';

// should go in a secret file
const config = {
    apiKey: "AIzaSyDrYf93dD294Qvkv5U3BExvxpJaRJLGlgs",
    authDomain: "react-chat-app-1c1d2.firebaseapp.com",
    databaseURL: "https://react-chat-app-1c1d2.firebaseio.com/",
    storageBucket: "gs://react-chat-app-1c1d2.appspot.com",
    messagingSenderId: "828411416589"
};
firebase.initializeApp(config);

export default firebase;
