'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function TestAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [session, setSession] = useState<any>(null)

  const testSignup = async () => {
    setLoading(true)
    setMessage('Signing up...')
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name
      })
      if (result.data) {
        setMessage('✅ Signup successful!')
        console.log('Signup result:', result)
      } else {
        setMessage('❌ Signup failed: ' + JSON.stringify(result.error))
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
      console.error('Signup error:', error)
    }
    setLoading(false)
  }

  const testSignin = async () => {
    setLoading(true)
    setMessage('Signing in...')
    try {
      const result = await authClient.signIn.email({
        email,
        password
      })
      if (result.data) {
        setMessage('✅ Signin successful!')
        console.log('Signin result:', result)
      } else {
        setMessage('❌ Signin failed: ' + JSON.stringify(result.error))
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
      console.error('Signin error:', error)
    }
    setLoading(false)
  }

  const testSession = async () => {
    try {
      const sessionData = await authClient.getSession()
      setSession(sessionData)
      setMessage(sessionData ? '✅ Session found!' : '❌ No session')
    } catch (error) {
      setMessage('❌ Session error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const testSignout = async () => {
    setLoading(true)
    setMessage('Signing out...')
    try {
      const result = await authClient.signOut()
      if (result.data) {
        setMessage('✅ Signout successful!')
        setSession(null)
      } else {
        setMessage('❌ Signout failed: ' + JSON.stringify(result.error))
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Better Auth Test</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Test User"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="password123"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={testSignup}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Sign Up
          </button>
          <button
            onClick={testSignin}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Sign In
          </button>
          <button
            onClick={testSession}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Check Session
          </button>
          <button
            onClick={testSignout}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            Sign Out
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="font-mono text-sm">{message}</p>
          </div>
        )}

        {session && (
          <div className="mt-4 p-3 bg-green-50 rounded">
            <h3 className="font-semibold mb-2">Session Data:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}