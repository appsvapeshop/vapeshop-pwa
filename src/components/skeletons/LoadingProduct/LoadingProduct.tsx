import classes from './LoadingProduct.module.css'

const LoadingProduct = () => {
  return (
    <div className={classes.container}>
      <div className={classes['image-loading']}></div>
      <div className={classes.description}>
        <div className={classes['loading-text']} style={{ width: 90 }}></div>
        <div className={classes['loading-text']} style={{ width: 125 }}></div>
        <div className={classes['loading-text']} style={{ width: 60 }}></div>
      </div>
    </div>
  )
}

export default LoadingProduct
