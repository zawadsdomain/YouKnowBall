import './PlayerSpotlightGrid.css';

interface PlayerSpotlightItem {
  name: string;
  team: string;
  position: string;
  imageUrl: string;
  changePercent: number;
  value: number;
}

const topRisers: PlayerSpotlightItem[] = [
  {
    name: 'Nikola Jokić',
    team: 'DEN',
    position: 'C',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203999.png',
    changePercent: 6.8,
    value: 14200,
  },
  {
    name: 'Luka Dončić',
    team: 'DAL',
    position: 'PG',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1629029.png',
    changePercent: 4.2,
    value: 12900,
  },
  {
    name: 'Shai Gilgeous-Alexander',
    team: 'OKC',
    position: 'PG',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/202683.png',
    changePercent: 3.6,
    value: 11850,
  },
];

const biggestDrops: PlayerSpotlightItem[] = [
  {
    name: 'Giannis Antetokounmpo',
    team: 'MIL',
    position: 'PF',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203507.png',
    changePercent: -2.4,
    value: 9200,
  },
  {
    name: 'Steph Curry',
    team: 'GSW',
    position: 'PG',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/201939.png',
    changePercent: -1.1,
    value: 8900,
  },
  {
    name: 'Anthony Edwards',
    team: 'MIN',
    position: 'SG',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1630162.png',
    changePercent: -0.9,
    value: 8650,
  },
];

const topEarners: PlayerSpotlightItem[] = [
  {
    name: 'Nikola Jokić',
    team: 'DEN',
    position: 'C',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203999.png',
    changePercent: 6.8,
    value: 24500,
  },
  {
    name: 'Luka Dončić',
    team: 'DAL',
    position: 'PG',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1629029.png',
    changePercent: 4.2,
    value: 23100,
  },
  {
    name: 'Shai Gilgeous-Alexander',
    team: 'OKC',
    position: 'PG',
    imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/202683.png',
    changePercent: 3.6,
    value: 21850,
  },
];

function renderCards(players: PlayerSpotlightItem[]) {
  return players.map((player) => {
    const isPositive = player.changePercent >= 0;

    return (
      <article key={player.name} className="player-card">
        <img src={player.imageUrl} alt={player.name} className="player-card__image" />
        <div className="player-card__content">
          <div className="player-card__title-row">
            <h3>{player.name}</h3>
            <span className={`player-card__value ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}
              {player.changePercent.toFixed(1)}%
            </span>
          </div>
          <p className="player-card__meta">
            <span>{player.team}</span>
            <span>•</span>
            <span>{player.position}</span>
          </p>
          <p className="player-card__earnings">${player.value.toLocaleString()}</p>
        </div>
      </article>
    );
  });
}

export default function PlayerSpotlightGrid() {
  return (
    <section className="player-spotlight-section">
      <div className="player-spotlight-heading">
        <h2>Your portfolio</h2>
        <p>Currently worth $24,850.00 across your active player holdings.</p>
      </div>

      <div className="player-section">
        <div className="player-section__header">
          <h3>Top risers</h3>
        </div>
        <div className="player-cards-grid">{renderCards(topRisers)}</div>
      </div>

      <div className="player-section">
        <div className="player-section__header">
          <h3>Lowest droppers</h3>
        </div>
        <div className="player-cards-grid">{renderCards(biggestDrops)}</div>
      </div>

      <div className="player-section">
        <div className="player-section__header">
          <h3>Top overall earners</h3>
        </div>
        <div className="player-cards-grid">{renderCards(topEarners)}</div>
      </div>
    </section>
  );
}
