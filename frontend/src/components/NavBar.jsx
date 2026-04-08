import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  // check if user is logged in by looking for token
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    // remove token from localStorage
    localStorage.removeItem('token')
    // redirect to home
    navigate('/')
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid #ccc'
    }}>
      {/* clicking logo always goes home */}
      <h2 onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        IdeaOn
      </h2>

      <div>
        {token ? (
          // if logged in show logout button
          <button onClick={handleLogout}>Logout</button>
        ) : (
          // if not logged in show login and register buttons
          <div>
            <button onClick={() => navigate('/login')} style={{marginRight: '10px'}}>
              Login
            </button>
            <button onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar