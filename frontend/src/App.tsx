import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Profile from './pages/Profile';
import Market from './pages/Market';
import './App.css';

function App() {

  return (
    <Router>
      <nav className="navbar">
        <h1>🏀 You Know Ball</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/market">Market</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/players" element={<Players />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
