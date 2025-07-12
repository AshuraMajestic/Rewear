import { useNavigate, useParams} from 'react-router-dom'
import AddEditItem from './AddEditForm'

export default function EditItem() {
    const { id } = useParams<{ id: string }>();
    const navigate=useNavigate()
    const handleClick=(path:string)=>{
        navigate(path)
    }

    return (
        <AddEditItem itemId={id} onBack={()=>handleClick("/profile")}/>
    )
}