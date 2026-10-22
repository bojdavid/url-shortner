import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)] font-sans">
      <Outlet />
    </div>
  )
}

export default App
