import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('hasAccount');
    navigate('/signup');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return;
    setIsDeleting(true);
    setError('');
    try {
      await apiClient.delete('/users/delete');
      logout();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1>Settings</h1>
        <p>Manage your account security and sign out.</p>
        {error && <div className="error">{error}</div>}

        <div className="settings-actions">
          <button className="btn-secondary" onClick={logout} disabled={isDeleting}>
            Logout
          </button>

          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting account...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
