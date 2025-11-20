import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'

function App() {
  return (
    <Routes>
      <Route path="/chat" element={<Chat />} />
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  )
}

export default App
