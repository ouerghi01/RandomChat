
'use client'
import { useParams } from 'next/navigation'
export default function Page() {
  const { id } = useParams(); // Destructure `id`

  return <p>Profile user : {id}</p>; // Display the id
}
