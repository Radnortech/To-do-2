import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { authRouter } from './routes/auth'
import './index.css'

// Handle email verification
const handleEmailVerification = () => {
  const urlParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')
  const type = urlParams.get('type')

  if (type === 'email' && accessToken && refreshToken) {
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    }))
    window.location.href = '/'
  }
}

handleEmailVerification()

const router = createBrowserRouter(authRouter)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
