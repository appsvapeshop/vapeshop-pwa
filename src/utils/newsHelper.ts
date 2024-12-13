import { Timestamp } from 'firebase/firestore'
import { News as NewsType } from '../types/News'
import { ref, deleteObject } from 'firebase/storage'
import { firestore, storage } from '../configs/firebaseConfig'
import {
  query,
  orderBy,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

export const getNews = async (): Promise<NewsType[]> => {
  const newsCollection = collection(firestore, 'news')
  const newsQuery = query(newsCollection, orderBy('createDate', 'desc'))
  const newsSnapshot = await getDocs(newsQuery)

  if (newsSnapshot.docs.length === 0) return []

  const news = newsSnapshot.docs.map((news) => {
    const newsData = Object.assign({ id: news.id }, news.data())
    return newsData as NewsType
  })

  return news
}

export const getNewsById = async (newsId: string): Promise<NewsType> => {
  const newsSnapshot = await getDoc(doc(firestore, 'news', newsId))
  if (newsSnapshot.exists()) {
    return Object.assign({ id: newsSnapshot.id }, newsSnapshot.data()) as NewsType
  } else {
    throw new Error('Category does not exist')
  }
}

export const upsertNews = async (news: NewsType) => {
  const { id: _, ...values } = news
  if (!news.id) {
    await addDoc(collection(firestore, 'news'), { ...values, createDate: Timestamp.now() })
  } else {
    await updateDoc(doc(firestore, 'news', news.id), {
      ...values
    })
  }
}

export const deleteNews = async (news: NewsType) => {
  const newsImage = ref(storage, news.img)
  await deleteObject(newsImage)
  await deleteDoc(doc(firestore, 'news', news.id))
}
