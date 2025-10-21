import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./index.css";

const Home = () => {
  const [pollCount, setPollCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [votesCount, setVotesCount] = useState(0);

  // Animate numbers on page load
  useEffect(() => {
    const animateCounter = (setter, target, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    animateCounter(setPollCount, 1247);
    animateCounter(setUserCount, 5423);
    animateCounter(setVotesCount, 18650);
  }, []);

  const features = [
    {
      icon: "🚀",
      title: "Real-time Results",
      description: "See poll results update instantly as votes come in",
    },
    {
      icon: "🎯",
      title: "Easy Creation",
      description:
        "Create professional polls in seconds with our intuitive interface",
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Get detailed insights and analytics for your polls",
    },
    {
      icon: "🔒",
      title: "Secure Voting",
      description: "Prevent duplicate votes with our secure voting system",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access polls seamlessly across all your devices",
    },
    {
      icon: "🌐",
      title: "Share Anywhere",
      description: "Share your polls on social media or embed in websites",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      text: "This app made gathering customer feedback so much easier!",
    },
    {
      name: "Mike Chen",
      role: "Event Organizer",
      text: "Perfect for engaging audiences during live events.",
    },
    {
      name: "Emma Davis",
      role: "Teacher",
      text: "My students love participating in class polls!",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🔥 Most Popular Polling Platform</span>
          </div>
          <h1 className="hero-title">
            Create <span className="highlight">Live Polls</span> That
            <br />
            Engage Your Audience
          </h1>
          <p className="hero-description">
            Gather real-time opinions, engage your audience, and make
            data-driven decisions with our powerful and easy-to-use polling
            platform.
          </p>
          <div className="hero-buttons">
            <Link to="/create-poll" className="btn primary-btn">
              <span>Create Your First Poll</span>
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/live-polls" className="btn secondary-btn">
              <span>View Live Polls</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{pollCount.toLocaleString()}</span>
              <span className="stat-label">Polls Created</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userCount.toLocaleString()}</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{votesCount.toLocaleString()}</span>
              <span className="stat-label">Votes Collected</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="floating-poll-card">
            <div className="poll-header">
              <h3>What's your favorite feature?</h3>
            </div>
            <div className="poll-options">
              <div className="poll-option">
                <span>Real-time updates</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "45%" }}></div>
                </div>
                <span>45%</span>
              </div>
              <div className="poll-option">
                <span>Easy sharing</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "32%" }}></div>
                </div>
                <span>32%</span>
              </div>
              <div className="poll-option">
                <span>Analytics</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "23%" }}></div>
                </div>
                <span>23%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>
              Everything you need to create engaging polls and gather valuable
              insights
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <h2>Get Started in Seconds</h2>
          <div className="quick-actions-grid">
            <Link to="/create-poll" className="action-card primary">
              <div className="action-icon">📝</div>
              <h3>Create Poll</h3>
              <p>
                Design your poll with multiple choice, rating, or open-ended
                questions
              </p>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/live-polls" className="action-card secondary">
              <div className="action-icon">👥</div>
              <h3>Join Polls</h3>
              <p>
                Participate in live polls and see results update in real-time
              </p>
              <span className="action-arrow">→</span>
            </Link>
            <Link to="/my-polls" className="action-card tertiary">
              <div className="action-icon">📊</div>
              <h3>My Dashboard</h3>
              <p>
                Manage your polls and analyze responses with detailed insights
              </p>
              <span className="action-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What People Are Saying</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.text}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{testimonial.name}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Polling?</h2>
            <p>
              Join thousands of users who trust our platform for their polling
              needs
            </p>
            <div className="cta-buttons">
              <Link to="/create-poll" className="btn primary-btn large">
                Get Started Free
              </Link>
              <Link to="/live-polls" className="btn outline-btn large">
                Explore Polls
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
