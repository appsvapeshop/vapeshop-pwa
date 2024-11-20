import { storage } from '../configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const uploadFile = async (data: Blob, path: string) => {
  const snapshot = await uploadBytes(ref(storage, path), data)
  const dataUrl = await getDownloadURL(snapshot.ref)
  return dataUrl
}
