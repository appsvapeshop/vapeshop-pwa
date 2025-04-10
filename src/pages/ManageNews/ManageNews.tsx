import { useState, useEffect } from 'react'
import classes from './ManageNews.module.css'
import { useNavigate } from 'react-router-dom'
import { getNews } from '../../services/NewsService'

import { Skeleton } from '@mui/material'
import News from '../../components/News/News'
import { AnimatedPage } from '../Cart/cartComponents'
import AddCard from '../../components/ui/AddCard/AddCard'

import { News as NewsType } from '../../types/News'

/**
 * Display all available News and AddCard for creating new News item.
 */
const ManageNews = () => {
  const navigate = useNavigate()
  const [news, setNews] = useState<NewsType[]>()
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Fetch all News.
   */
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
          [...Array(3)].map((_element, index) => <Skeleton key={index} variant="rounded" height={150} width="80%" />)}

        {!isLoading && (
          <>
            <AddCard className={classes['add-card']} onClick={() => navigate('new')} />
            {news?.map((newsItem) => <News key={newsItem.id} news={newsItem} onClick={() => navigate(newsItem.id)} />)}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageNews
