import classes from './ManageNews.module.css'
import { useNavigate } from 'react-router-dom'
import { AnimatedPage } from '../Cart/cartComponents'
import { getNews } from '../../utils/newsHelper'
import { useState, useEffect } from 'react'
import { News as NewsType } from '../../types/News'
import { Skeleton } from '@mui/material'
import News from '../../components/News/News'
import AddCard from '../../components/ui/AddCard/AddCard'

const ManageNews = () => {
  const navigate = useNavigate()
  const [news, setNews] = useState<NewsType[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getNews()
      .then((newsSnapshot) => {
        setNews(newsSnapshot)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading &&
          [...Array(3)].map((_element, index) => (
            <Skeleton key={index} variant="rounded" height={150} width="80%" />
          ))}

        {!isLoading && (
          <>
            <AddCard className={classes['add-card']} onClick={() => navigate('new')} />
            {news?.map((newsItem) => (
              <News key={newsItem.id} data={newsItem} onClick={() => navigate(newsItem.id)}/>
            ))}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageNews
