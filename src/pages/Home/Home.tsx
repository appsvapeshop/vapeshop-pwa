import classes from './Home.module.css'
import { useEffect, useState } from 'react'
import News from '../../components/News/News'
import { getNews } from '../../services/NewsService'
import { News as NewsType } from '../../types/News'
import UserPoints from '../../components/UserPoints/UserPoints'
import LoadingNews from '../../components/skeletons/LoadingNews/LoadingNews'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [news, setNews] = useState<NewsType[]>()

  useEffect(() => {
    getNews()
      .then((newsSnapshot) => setNews(newsSnapshot))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AnimatedPage>
      <div className={classes.container}>
        <UserPoints />

        {isLoading && (
          <>
            <LoadingNews />
            <LoadingNews />
            <LoadingNews />
          </>
        )}

        {!isLoading &&
          news !== undefined &&
          news.length !== 0 &&
          news.map((newsRecord) => (
            <News key={newsRecord.id} news={newsRecord} onClick={() => {}} />
          ))}
      </div>
    </AnimatedPage>
  )
}

export default Home
