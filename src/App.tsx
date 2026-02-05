import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { checkAuth, logout } from './hooks/useAuth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);
    setLoading(false);
  }, []);

  if (loading) {
      return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>
  }

  const handleLogout = () => {
      logout();
      setIsAuthenticated(false);
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a]">
      {!isAuthenticated ? (
        <Auth onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
