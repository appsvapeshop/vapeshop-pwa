import { useParams } from 'react-router-dom'
import classes from './ManageProductVariants.module.css'
import AddCard from '../../components/ui/AddCard/AddCard'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const ManageProductVariants = () => {
  const variants = ['wariant 1', 'wariant 2', 'wariant 3', 'wariant 4']
  const { productId } = useParams()

  return (
    <div className={classes.container}>
      <AddCard className={classes['add-card']}/>
      {variants.map(variant => (
        <TappedComponent className={classes.variant}>{variant}</TappedComponent>
      ))}
    </div>
  )
}

export default ManageProductVariants