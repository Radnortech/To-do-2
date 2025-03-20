import { useNavigate } from 'react-router-dom'
import { signOut } from '../lib/supabase'

export default function Header() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
