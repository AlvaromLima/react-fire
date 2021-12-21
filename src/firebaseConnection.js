import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyDvxOdf3RGdWvlfQGYC3haJzobbXqejmWU",
    authDomain: "curso-react-7baa1.firebaseapp.com",
    projectId: "curso-react-7baa1",
    storageBucket: "curso-react-7baa1.appspot.com",
    messagingSenderId: "944541156665",
    appId: "1:944541156665:web:7bbbe410e0994e5d5cd4e8",
    measurementId: "G-QD426R6446"
};

//Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;



