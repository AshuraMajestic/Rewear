import { useNavigate } from "react-router-dom";
import AddEditItem from "./AddEditForm";

export default function AddItem() {
  const navigate=useNavigate()
    const handleClick=(path:string)=>{
        navigate(path)
    }
  return (
        <AddEditItem onBack={()=>handleClick("/profile")}/>
  )
}
