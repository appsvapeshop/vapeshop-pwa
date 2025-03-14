import { News as NewsType } from '../types/News'
import NewsNotFound from '../exceptions/NewsNotFound'
import ImageIsRequired from '../exceptions/ImageIsRequired'

import { deleteObject, ref } from 'firebase/storage'
import { firestore, storage } from '../configs/firebaseConfig'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from 'firebase/firestore'

/**
 * Get all news
 *
 * @return all news
 */
export const getNews = async (): Promise<NewsType[]> => {
  const newsCollection = collection(firestore, 'news')
  const newsQuery = query(newsCollection, orderBy('createDate', 'desc'))
  const newsSnapshot = await getDocs(newsQuery)

  if (newsSnapshot.docs.length === 0) return []

  return newsSnapshot.docs.map((news) => {
    const newsData = Object.assign({ id: news.id }, news.data())
    return newsData as NewsType
  })
}

/**
 * Get News for given category ID
 *
 * @param newsId. Must not be null
 *
 * @return News for given ID
 */
export const getNewsById = async (newsId: string): Promise<NewsType> => {
  const newsSnapshot = await getDoc(doc(firestore, 'news', newsId))
  if (newsSnapshot.exists()) {
    return Object.assign({ id: newsSnapshot.id }, newsSnapshot.data()) as NewsType
  } else {
    throw new NewsNotFound()
  }
}

/**
 * Upsert given News record
 *
 * @param news record. Must not be null
 */
export const upsertNews = async (news: NewsType) => {
  if (!news.img) throw new ImageIsRequired()

  const { id: _, ...values } = news

  if (!news.id) {
    await addDoc(collection(firestore, 'news'), { ...values, createDate: Timestamp.now() })
  } else {
    await updateDoc(doc(firestore, 'news', news.id), {
      ...values,
      updateDate: Timestamp.now()
    })
  }
}

/**
 * Delete given News and image assigned to this News
 *
 * @param news record. Must not be null
 */
export const deleteNews = async (news: NewsType) => {
  const newsImage = ref(storage, news.img)
  await deleteObject(newsImage)
  await deleteDoc(doc(firestore, 'news', news.id))
}
