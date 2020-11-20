import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA0nGDnFX2ilcUCwpB0alXXdK0kTpPauOE",
    authDomain: "socialapp-176d1.firebaseapp.com",
    databaseURL: "https://socialapp-176d1.firebaseio.com",
    projectId: "socialapp-176d1",
    storageBucket: "socialapp-176d1.appspot.com",
    messagingSenderId: "625018455184",
    appId: "1:625018455184:web:c27db3ab3cf04910b20415"
  };


firebase.initializeApp(firebaseConfig);

export const f=firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
