// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid'; // string randomization 

const firebaseConfig = {
  apiKey: "AIzaSyDjdcKhDhIpEIrltVMjzwO1yBs6R3IDYE8",
  authDomain: "easel-e38a5.firebaseapp.com",
  databaseURL: "https://easel-e38a5-default-rtdb.firebaseio.com",
  projectId: "easel-e38a5",
  storageBucket: "easel-e38a5.appspot.com",
  messagingSenderId: "950055956883",
  appId: "1:950055956883:web:8f9f5f1d7e9a62183f3866",
  measurementId: "G-1YG8FCCPHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app); 

// image ref is actually a reference to the image file given by the user 
export async function uploadImageGetURL(imageref:any, folderName:string){
  if(imageref.value === undefined) return;
  const imgRef = ref(storage, folderName+'/'+v4()+'.png', ); //v4() for random unique file name 
  const imgResponse = await uploadBytes(imgRef, imageref.value); 

  const imgSrc = await getDownloadURL(imgResponse.ref); 
  return imgSrc; 
}