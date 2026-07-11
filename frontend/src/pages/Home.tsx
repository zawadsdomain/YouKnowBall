import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to You Know Ball</h1>
        <p className="subtitle">The NBA Virtual Stock Market</p>
        <p className="description">
          Trade virtual shares of your favorite NBA players. Build your portfolio,
          compete with friends, and prove your ball knowledge.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🏀</div>
          <h3>Real Player Stocks</h3>
          <p>Buy and sell shares of NBA players whose stock rises and falls with their performance.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Live Market</h3>
          <p>Watch player stock prices update in real-time based on actual game performance and stats.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Virtual Currency</h3>
          <p>Start with virtual cash and grow your wealth by making smart trading decisions.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Leaderboard</h3>
          <p>Compete globally or against your friends and climb the leaderboard.</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Create an account or login to begin trading NBA player stocks.</p>
        <div className="cta-buttons">
          <button className="btn-primary">Sign Up</button>
          <button className="btn-secondary">Login</button>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Create Account</h4>
            <p>Sign up and receive 10,000 virtual dollars</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Browse Players</h4>
            <p>View all NBA players and their current stock prices</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Buy Stocks</h4>
            <p>Purchase shares of players you believe will perform well</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Watch Growth</h4>
            <p>Prices update based on player performance and stats</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <h4>Sell & Profit</h4>
            <p>Sell when prices are high to lock in gains</p>
          </div>
          <div className="step">
            <div className="step-number">6</div>
            <h4>Compete</h4>
            <p>Climb the leaderboard and become the best trader</p>
          </div>
        </div>
      </div>
    </div>
  );
}
