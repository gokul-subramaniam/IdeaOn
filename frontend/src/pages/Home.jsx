import { useEffect, useState } from 'react'
import API from '../services/api'

function Home() {
  const [organizations, setOrganizations] = useState([])

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
        <div key={org.id}>
          <h3>{org.name}</h3>
          <p>{org.category}</p>
          <p>{org.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Home