import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../services/api'

function OrgPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [org, setOrg] = useState(null)

  useEffect(() => {
    // fetch org details
    API.get(`/organizations/${slug}`)
      .then(res => setOrg(res.data))
      .catch(err => console.error(err))

    // fetch suggestions
    API.get(`/suggestions/${slug}`)
      .then(res => setSuggestions(res.data))
      .catch(err => console.error(err))
  }, [slug])

  return (
    <div>
      <button onClick={() => navigate('/')}>← Back</button>
      {org && (
        <div>
          <h1>{org.name}</h1>
          <p>{org.category} — {org.description}</p>
        </div>
      )}
      <h2>Suggestions</h2>
      {suggestions.length === 0 ? (
        <p>No suggestions yet</p>
      ) : (
        suggestions.map(suggestion => (
          <div key={suggestion.id} style={{borderBottom: '1px solid #ccc', padding: '10px'}}>
            <p><strong>{suggestion.username}</strong></p>
            <p>{suggestion.body}</p>
            <p>Flags: {suggestion.flag_count}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default OrgPage