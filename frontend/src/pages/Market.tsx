import { useState, useEffect } from 'react';
// import apiClient from '../services/api';
import './Market.css';

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  price: number;
  priceChange: number;
  percentChange: number;
  volume: number;
  marketCap: number;
  dayHigh: number;
  dayLow: number;
  avgRating: number;
}

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'LeBron James',
    team: 'LAL',
    position: 'SF',
    price: 145.25,
    priceChange: 3.12,
    percentChange: 2.19,
    volume: 15420,
    marketCap: 1452500,
    dayHigh: 147.8,
    dayLow: 141.9,
    avgRating: 4.9,
  },
  {
    id: '2',
    name: 'Stephen Curry',
    team: 'GSW',
    position: 'PG',
    price: 152.6,
    priceChange: -2.44,
    percentChange: -1.57,
    volume: 18930,
    marketCap: 1526000,
    dayHigh: 156.2,
    dayLow: 151.1,
    avgRating: 4.8,
  },
  {
    id: '3',
    name: 'Nikola Jokic',
    team: 'DEN',
    position: 'C',
    price: 168.9,
    priceChange: 5.73,
    percentChange: 3.51,
    volume: 12041,
    marketCap: 1689000,
    dayHigh: 170.2,
    dayLow: 162.7,
    avgRating: 5.0,
  },
  {
    id: '4',
    name: 'Jayson Tatum',
    team: 'BOS',
    position: 'SF',
    price: 139.45,
    priceChange: -0.88,
    percentChange: -0.63,
    volume: 8420,
    marketCap: 1394500,
    dayHigh: 141.3,
    dayLow: 137.5,
    avgRating: 4.6,
  },
  {
    id: '5',
    name: 'Giannis Antetokounmpo',
    team: 'MIL',
    position: 'PF',
    price: 160.8,
    priceChange: 4.15,
    percentChange: 2.65,
    volume: 11203,
    marketCap: 1608000,
    dayHigh: 162.9,
    dayLow: 156.8,
    avgRating: 4.9,
  },
];


export default function Market() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'rating'>('price');
  const [filterTeam, setFilterTeam] = useState('all');
  const [teams, setTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPlayers(mockPlayers);

    setLoading(false);
  }, []);

  const filteredAndSortedPlayers = players
    .filter((player) => {
      const teamMatch = filterTeam === 'all' || player.team === filterTeam;
      const searchMatch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      return teamMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'change') return b.percentChange - a.percentChange;
      if (sortBy === 'volume') return b.volume - a.volume;
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      return 0;
    });

  if (loading) return <div className="market loading">Loading market data...</div>;
  if (error) return <div className="market error">{error}</div>;

  const topGainer = [...players].sort((a, b) => b.percentChange - a.percentChange)[0];
  const topLoser = [...players].sort((a, b) => a.percentChange - b.percentChange)[0];
  const mostVolume = [...players].sort((a, b) => b.volume - a.volume)[0];

  return (
    <div className="market">
      <div className="market-header">
        <h1>Market</h1>
        <p className="subtitle">Live NBA Player Stock Prices</p>
      </div>

      <div className="market-stats">
        <div className="stat">
          <span className="label">Top Gainer</span>
          <span className="value">
            {topGainer?.name}
            <span className="change positive">
              ▲ {topGainer?.percentChange.toFixed(2)}%
            </span>
          </span>
        </div>
        <div className="stat">
          <span className="label">Top Loser</span>
          <span className="value">
            {topLoser?.name}
            <span className="change negative">
              ▼ {Math.abs(topLoser?.percentChange || 0).toFixed(2)}%
            </span>
          </span>
        </div>
        <div className="stat">
          <span className="label">Most Active</span>
          <span className="value">
            {mostVolume?.name}
            <span className="volume">{mostVolume?.volume.toLocaleString()} trades</span>
          </span>
        </div>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
            <option value="all">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by Change %</option>
            <option value="volume">Sort by Volume</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      <div className="players-container">
        {filteredAndSortedPlayers.length === 0 ? (
          <div className="empty-state">
            <p>No players found matching your criteria.</p>
          </div>
        ) : (
          <table className="players-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Position</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>24h High/Low</th>
                <th>Volume</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPlayers.map((player) => (
                <tr key={player.id} className={player.priceChange >= 0 ? 'positive' : 'negative'}>
                  <td className="player-name">{player.name}</td>
                  <td>{player.team}</td>
                  <td>{player.position}</td>
                  <td className="price">${player.price.toFixed(2)}</td>
                  <td className={`change ${player.priceChange >= 0 ? 'positive' : 'negative'}`}>
                    <span className="change-value">
                      {player.priceChange >= 0 ? '▲' : '▼'}
                      {Math.abs(player.priceChange).toFixed(2)} ({player.percentChange.toFixed(2)}%)
                    </span>
                  </td>
                  <td className="range">
                    ${player.dayLow.toFixed(2)} - ${player.dayHigh.toFixed(2)}
                  </td>
                  <td className="volume">{player.volume.toLocaleString()}</td>
                  <td className="rating">
                    <div className="rating-stars">
                      {Array(Math.round(player.avgRating))
                        .fill(0)
                        .map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      <span className="rating-value">{player.avgRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <button className="btn-trade" onClick={() => console.log('Trade', player.id)}>
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="market-info">
        <p>Prices update every 30 seconds. Trade any player to lock in your gains or losses.</p>
      </div>
    </div>
  );
}
