import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import './App.css';

function App() {

  return (
    <Router>
      <nav className="navbar">
        <h1>🏀 You Know Ball</h1>
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/players">Players</a></li>
        </ul>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
