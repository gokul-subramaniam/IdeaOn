import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
  setError('All fields are required')
  return
}
    try {
      const res = await API.post('/auth/login', formData)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response.data.error)
    }
  }

  return (
    <div>
      <h1>Login</h1>
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
  Don't have an account?{' '}
  <span 
    onClick={() => navigate('/register')} 
    style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
  >
    Register
  </span>
</p>
    </div>
  )
}

export default Login