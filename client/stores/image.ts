// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjdcKhDhIpEIrltVMjzwO1yBs6R3IDYE8",
  authDomain: "easel-e38a5.firebaseapp.com",
  projectId: "easel-e38a5",
  storageBucket: "easel-e38a5.appspot.com",
  messagingSenderId: "950055956883",
  appId: "1:950055956883:web:8f9f5f1d7e9a62183f3866",
  measurementId: "G-1YG8FCCPHC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
export default firebase;

export function uploadImage(name:string, fileType:any, ) {
    const ref = firebase.storage().ref();
    // const file = document.querySelector("#photo").files[0];
    // const name = +new Date() + "-" + file.name;
    // const metadata = {
    //     contentType: file.type
    // };
    // const task = ref.child(name).put(file, metadata);task
    // .then(snapshot => snapshot.ref.getDownloadURL())
    // .then(url => {
    // console.log(url);
    // alert('image uploaded successfully');
    // document.querySelector("#image").src = url;
};