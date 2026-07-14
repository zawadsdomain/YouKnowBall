import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import './Profile.css';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  balance: number;
  totalInvested: number;
  portfolioValue: number;
  joinDate: string;
}

interface Holding {
  playerId: string;
  playerName: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio'>('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch the authenticated user's profile first. If that succeeds,
        // request holdings for that specific user by ID.
        const userRes = await apiClient.get('/users/profile');
        const userData = userRes.data?.data ?? userRes.data;

        // Normalize and provide safe defaults for numeric fields so rendering
        // doesn't crash if the backend omits fields.
        const normalizedUser = {
          id: userData?.id ?? userData?.uid ?? userData?.userId ?? null,
          username: userData?.username ?? userData?.displayName ?? 'User',
          email: userData?.email ?? '',
          balance: Number(userData?.balance ?? 0),
          totalInvested: Number(userData?.totalInvested ?? 0),
          portfolioValue: Number(userData?.portfolioValue ?? 0),
          joinDate: userData?.joinDate ?? userData?.createdAt ?? null,
        } as UserProfile;

        setUser(normalizedUser);

        // If the backend exposes holdings per-user at /holdings/:userId, use it.
        const userId = normalizedUser.id;
        if (userId) {
          const holdingsRes = await apiClient.get(`/holdings/${userId}`);
          const rawHoldings = holdingsRes.data?.data ?? holdingsRes.data ?? [];
          // Normalize holdings to ensure numeric fields are numbers.
          const normalizedHoldings: Holding[] = rawHoldings.map((h: any) => ({
            playerId: h.playerId ?? h.id ?? 'unknown',
            playerName: h.playerName ?? h.name ?? 'Unknown Player',
            shares: Number(h.shares ?? h.quantity ?? 0),
            purchasePrice: Number(h.purchasePrice ?? h.avgPrice ?? 0),
            currentPrice: Number(h.currentPrice ?? h.current ?? 0),
            totalValue: Number(h.totalValue ?? (h.shares ?? 0) * (h.currentPrice ?? h.current ?? 0)),
          }));

          setHoldings(normalizedHoldings);
        } else {
          // No user id available — set empty holdings but continue.
          setHoldings([]);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile loading">Loading...</div>;
  if (error) return <div className="profile error">{error}</div>;
  if (!user) return <div className="profile error">User data not found</div>;

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + (h.totalValue ?? 0), 0);
  const gainLoss = totalPortfolioValue - (user.totalInvested ?? 0);
  const gainLossPercent = (user.totalInvested ?? 0) > 0 ? (gainLoss / (user.totalInvested ?? 0)) * 100 : 0;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="email">{user.email}</p>
          <p className="join-date">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio ({holdings.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="stats-grid">

              <div className="stat-card">
                <h3>Cash Available</h3>
                <p className="stat-value">${(user.balance ?? 0).toFixed(2)}</p>
              </div>

              <div className="stat-card">
                <h3>Total Invested</h3>
                <p className="stat-value">${(user.totalInvested ?? 0).toFixed(2)}</p>
              </div>

            <div className="stat-card">
              <h3>Portfolio Value</h3>
              <p className="stat-value">${totalPortfolioValue.toFixed(2)}</p>
            </div>

            <div className={`stat-card ${gainLoss >= 0 ? 'positive' : 'negative'}`}>
              <h3>Gain/Loss</h3>
              <p className="stat-value">
                ${Math.abs(gainLoss).toFixed(2)}
                <span className={gainLoss >= 0 ? 'gain' : 'loss'}>
                  {gainLoss >= 0 ? '▲' : '▼'} {Math.abs(gainLossPercent).toFixed(2)}%
                </span>
              </p>
            </div>
          </div>

          <div className="total-worth">
            <h2>Total Net Worth</h2>
            <p className="net-worth">${((user.balance ?? 0) + totalPortfolioValue).toFixed(2)}</p>
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="portfolio-tab">
          {holdings.length === 0 ? (
            <div className="empty-state">
              <p>You haven't made any trades yet.</p>
              <p>Head to the market to start building your portfolio!</p>
            </div>
          ) : (
            <table className="holdings-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Shares</th>
                  <th>Avg. Price</th>
                  <th>Current Price</th>
                  <th>Total Value</th>
                  <th>Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  const gain = (holding.totalValue ?? 0) - (holding.purchasePrice ?? 0) * (holding.shares ?? 0);
                  const gainPercent = (holding.purchasePrice ?? 0) > 0 ? (((holding.currentPrice ?? 0) - (holding.purchasePrice ?? 0)) / (holding.purchasePrice ?? 0)) * 100 : 0;

                  return (
                    <tr key={holding.playerId} className={gain >= 0 ? 'positive' : 'negative'}>
                      <td className="player-name">{holding.playerName}</td>
                      <td>{holding.shares}</td>
                      <td>${(holding.purchasePrice ?? 0).toFixed(2)}</td>
                      <td>${(holding.currentPrice ?? 0).toFixed(2)}</td>
                      <td>${(holding.totalValue ?? 0).toFixed(2)}</td>
                      <td className="gain-loss">
                        ${Math.abs(gain).toFixed(2)}
                        <span className={gain >= 0 ? 'gain' : 'loss'}>
                          {gain >= 0 ? '▲' : '▼'} {Math.abs(gainPercent).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
