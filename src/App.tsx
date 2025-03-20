import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

export default function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim() || loading) return
    
    setLoading(true)
    try {
      const session = await supabase.auth.getSession()
      if (!session.data.session) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          task: newTodo,
          user_id: session.data.session.user.id 
        }])
        .select()
        .single()

      if (error) throw error

      setTodos([data, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Your Todos</h2>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Add a new todo"
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="p-4 bg-white rounded shadow">
              {todo.task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
