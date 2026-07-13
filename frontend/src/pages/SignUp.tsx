import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './SignUp.css';

export default function SignUp() {
  const navigate = useNavigate();

  // Controlled form fields for signup.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If the user already has an account flag, redirect them away from signup.
    const hasAccount = localStorage.getItem('hasAccount');
    if (hasAccount) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send signup request to backend and receive auth data.
      const resp = await apiClient.post('/users/signup', { username, email, password });

      // Save backend auth token if provided.
      if (resp.data?.token) {
        localStorage.setItem('authToken', resp.data.token);
      }

      // Mark the user as having an account so the route guard stops redirecting.
      localStorage.setItem('hasAccount', 'true');

      // After successful signup, send user to the dashboard.
      navigate('/dashboard');
    } catch (err: any) {
      // Display a friendly error if signup fails.
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Welcome — Create your account</h1>
        <p className="greeting">Join You Know Ball and get $10,000 in virtual cash to start trading.</p>

        {/* Signup form for new users. */}
        <form onSubmit={handleSubmit} className="signup-form">
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
