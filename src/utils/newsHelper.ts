import { News as NewsType } from '../types/News'
import { firestore } from '../configs/firebaseConfig'
import { query, orderBy, collection, getDocs, getDoc, doc } from 'firebase/firestore'

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
