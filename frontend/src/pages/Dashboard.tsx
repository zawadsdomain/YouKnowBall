import { useState, useEffect } from 'react';
import apiClient from '../services/api';

interface User {
  id: string;
  username: string;
  balance: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Call the protected backend profile endpoint.
        // The backend returns { success, data: userData }, so read response.data.data.
        const response = await apiClient.get('/users/profile');
        setUser(response.data.data);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.username}!</p>
          <p>Balance: ${user.balance.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
