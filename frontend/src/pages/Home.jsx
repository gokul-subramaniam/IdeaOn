import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Home() {
  const [organizations, setOrganizations] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/organizations')
      .then(res => setOrganizations(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>IdeaOn</h1>
      <h2>Organizations</h2>
      {organizations.map(org => (
        <div 
          key={org.id} 
          onClick={() => navigate(`/org/${org.slug}`)}
          style={{cursor: 'pointer', borderBottom: '1px solid #ccc', padding: '10px'}}
        >
          <h3>{org.name}</h3>
          <p>{org.category}</p>
          <p>{org.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Home