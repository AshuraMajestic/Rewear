import { useParams } from "react-router-dom";

export default function ItemsDetails() {
     const { id } = useParams<{ id: string }>();
  return (
    <div>ItemsDetails</div>
  )
}
