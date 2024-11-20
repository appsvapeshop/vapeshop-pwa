import classes from './ErrorOccurs.module.css'
import angryCloud from '../../assets/angry_cloud.png'

const ErrorOccurs = () => {
  return (
    <div className={classes.container}>
      <img src={angryCloud} alt="angry cloud" />
      <h2>Upsss coś poszło nie tak</h2>
    </div>
  )
}

export default ErrorOccurs
