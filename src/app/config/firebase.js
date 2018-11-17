import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBK_1GMwQnPotNw_2QA7EauN1Kwz09q90Q",
  authDomain: "revents-674b0.firebaseapp.com",
  databaseURL: "https://revents-674b0.firebaseio.com",
  projectId: "revents-674b0",
  storageBucket: "revents-674b0.appspot.com",
  messagingSenderId: "1017575616048"
}

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)
export default firebase;