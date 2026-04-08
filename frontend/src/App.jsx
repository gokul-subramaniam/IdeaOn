import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import OrgPage from './pages/OrgPage'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/org/:slug" element={<OrgPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App