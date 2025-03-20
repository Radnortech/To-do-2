import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmail, signUpWithEmail } from '../lib/supabase'

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = mode === 'login' 
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password)

      if (error) {
        throw error
      }

      // Only navigate if we have a valid session
      if (data?.user) {
        navigate('/')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-surface-900">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-surface-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-surface-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>

        <div className="text-center text-sm text-surface-600">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-primary-600 hover:text-primary-500">
                Sign up
              </a>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <a href="/auth/login" className="text-primary-600 hover:text-primary-500">
                Login
              </a>
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
