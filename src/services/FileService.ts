import { storage } from '../configs/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

/**
 * Upload given file ( in Blob ) into file storage
 *
 * @param data encoded in Blob
 * @param path where file should be stored in storage
 *
 * @return url for uploaded file
 */
export const uploadFile = async (data: Blob, path: string) => {
  const snapshot = await uploadBytes(ref(storage, path), data)
  return await getDownloadURL(snapshot.ref)
}
