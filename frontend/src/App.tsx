import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Profile from './pages/Profile';
import Market from './pages/Market';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Settings from './pages/Settings';
import './App.css';

// Helper to determine whether the user is currently authenticated.
// We rely on the auth token stored in localStorage, not a stale account flag.
const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));

function App() {
  // If the user does not have an account, do not show the normal app navigation.
  const userLoggedIn = isAuthenticated();

  return (
    <Router>
      {/* Only show the site navigation once the user is authenticated. */}
      {userLoggedIn && (
        <nav className="navbar">
          <h1>🏀 You Know Ball</h1>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/market">Market</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
                <li><a href="/settings">Settings</a></li>
          </ul>
        </nav>
      )}

      <main className="container">
        <Routes>
          {/* Redirect unauthenticated users to signup for every protected route. */}
          <Route
            path="/"
            element={userLoggedIn ? <Home /> : <Navigate to="/signup" replace />}
          />
          <Route
            path="/market"
            element={userLoggedIn ? <Market /> : <Navigate to="/signup" replace />}
          />
          <Route
            path="/dashboard"
            element={userLoggedIn ? <Dashboard /> : <Navigate to="/signup" replace />}
          />
          <Route
            path="/profile"
            element={userLoggedIn ? <Profile /> : <Navigate to="/signup" replace />}
          />
          <Route
            path="/players"
            element={userLoggedIn ? <Players /> : <Navigate to="/signup" replace />}
          />
          <Route
            path="/settings"
            element={userLoggedIn ? <Settings /> : <Navigate to="/signup" replace />}
          />

          {/* The signup page is the only page unauthenticated users can access. */}
          <Route
            path="/signup"
            element={userLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUp />}
          />
          <Route
            path="/login"
            element={userLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          {/* Catch-all route redirects to signup if unauthenticated, otherwise home. */}
          <Route
            path="*"
            element={userLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/signup" replace />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
