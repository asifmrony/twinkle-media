import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDu-_XY3BHcqu20giNj88eRM4cHbB6-CRc",
    authDomain: "amr-linkedin-clone.firebaseapp.com",
    projectId: "amr-linkedin-clone",
    storageBucket: "amr-linkedin-clone.appspot.com",
    messagingSenderId: "977211653919",
    appId: "1:977211653919:web:0357e22cf7869cc53ffa2a"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Get a list of cities from your database
// async function getCities(db) {
//     const citiesCol = collection(db, 'cities');
//     const citySnapshot = await getDocs(citiesCol);
//     const cityList = citySnapshot.docs.map(doc => doc.data());
//     return cityList;
// }


export {db, auth};