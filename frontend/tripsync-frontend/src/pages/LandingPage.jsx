import React from 'react';
import '../App.css';

function LandingPage() {
  const features = [
    {
      icon: '🗺️',
      title: 'Collaborative Planning',
      description: 'Create trips and invite friends to plan together in real-time.'
    },
    {
      icon: '📅',
      title: 'Detailed Itineraries',
      description: 'Organize day-by-day activities and locations for your trip.'
    },
    {
      icon: '💰',
      title: 'Expense Tracking',
      description: 'Track group expenses and see who paid for what.'
    },
    {
      icon: '🔒',
      title: 'Secure Authentication',
      description: 'Safe and secure user registration and login system.'
    }
  ];

  return (
    <div className="App">
      {/* Navbar */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>✈️</span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>TripSync</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              textDecoration: 'none',
              color: '#374151',
              fontWeight: '500',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>Login</button>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '6rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          Plan Your Perfect Trip<br />
          <span style={{ color: '#fde047' }}>Together</span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          opacity: 0.9,
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }}>
          No more complicated spreadsheets or lost conversations. TripSync makes group travel planning simple, organized, and fun.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            backgroundColor: 'white',
            color: '#667eea',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}>Get Started Free</button>
          <button style={{
            backgroundColor: '#5b21b6',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            border: '2px solid #8b5cf6',
            cursor: 'pointer'
          }}>Learn More</button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: '#111827' }}>
            Everything You Need to Plan
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            Powerful features designed for seamless group travel planning
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#111827' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        backgroundColor: '#111827',
        color: 'white',
        padding: '4rem 2rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>10K+</div>
            <div style={{ color: '#9ca3af' }}>Trips Planned</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>50K+</div>
            <div style={{ color: '#9ca3af' }}>Happy Users</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>100+</div>
            <div style={{ color: '#9ca3af' }}>Countries</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>4.9★</div>
            <div style={{ color: '#9ca3af' }}>User Rating</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#9ca3af' }}>&copy; 2025 TripSync - UNIFESP Software Engineering Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;