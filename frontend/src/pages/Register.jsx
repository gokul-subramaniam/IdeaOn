import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // check all fields are filled
if (!formData.email || !formData.username || !formData.password) {
  setError('All fields are required')
  return
}
    try {
      await API.post('/auth/register', formData)
      navigate('/login')
    } catch (err) {
      setError(err.response.data.error)
    }
  }

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>
        Already have an account? Login
      </p>
    </div>
  )
}

export default Register