import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { persistentLocalCache, initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC-Uqxl-vNp0FmpRlAh-v4GWNetu90cz-o',
  authDomain: 'vapeshopts.firebaseapp.com',
  projectId: 'vapeshopts',
  storageBucket: 'vapeshopts.appspot.com',
  messagingSenderId: '913724181305',
  appId: '1:913724181305:web:40b64a4d7badf8cc7c36e8',
  measurementId: 'G-MPBXL4J6EK'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app, 'gs://vapeshopts.appspot.com')
const firestore = initializeFirestore(app, { localCache: persistentLocalCache({}) })

export { app, auth, firestore, storage }
