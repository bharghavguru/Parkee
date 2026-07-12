import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Video, 
  CheckCircle2, 
  Star, 
  Map, 
  ClipboardList, 
  Car, 
  MessageSquare,
  User, 
  ChevronRight,
  LogOut,
  CreditCard
} from 'lucide-react';
import Logo from './Logo';
import UserProfile from './UserProfile';

export default function HomeNearbySpots({ currentUser, onLogout, onSwitchToHost, onSelectSpot, activeBooking, initialTab = 'home' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab); // 'home' | 'bookings' | 'messages' | 'profile'
  const [cctvFilter, setCctvFilter] = useState(false);
  const [securityFilter, setSecurityFilter] = useState(false);

  // Spot Mock Data
  const allSpots = [
    {
      id: 1,
      title: '12 Khader Nawaz Khan Road',
      distance: '0.2 km away',
      type: 'Driveway',
      price: '80.00',
      rating: '4.9',
      reviews: 156,
      verified: true,
      cctv: true,
      security: true,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'T. Nagar Multi-Level Parking',
      distance: '0.5 km away',
      type: 'Underground',
      price: '120.00',
      rating: '4.7',
      reviews: 89,
      verified: false,
      cctv: true,
      security: true,
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'Adyar Private Car Park',
      distance: '0.8 km away',
      type: 'Private Lot',
      price: '60.00',
      rating: '4.5',
      reviews: 210,
      verified: false,
      cctv: false,
      security: false,
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // Filtering Logic
  const filteredSpots = allSpots.filter(spot => {
    const matchesSearch = spot.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCctv = !cctvFilter || spot.cctv;
    const matchesSecurity = !securityFilter || spot.security;
    return matchesSearch && matchesCctv && matchesSecurity;
  });

  const renderHomeContent = () => {
    return (
      <>
        {/* Search header container */}
        <div className="home-search-wrapper">
          <div className="search-bar-inner">
            <Search size={18} className="search-icon-left" />
            <input 
              type="text" 
              placeholder="Where do you want to park?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
            <div className="search-location-badge">
              <MapPin size={14} className="location-pin-pink" />
              <span>Chennai</span>
            </div>
          </div>
        </div>

        {/* Filter Scroll Chips Row */}
        <div className="home-filters-row">
          <button 
            type="button" 
            className="filter-chip btn-filter-main"
            onClick={() => { setCctvFilter(false); setSecurityFilter(false); }}
            title="Reset Filters"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <button 
            type="button" 
            className={`filter-chip ${cctvFilter ? 'active-chip' : ''}`}
            onClick={() => setCctvFilter(!cctvFilter)}
          >
            <span>CCTV only</span>
          </button>

          <button 
            type="button" 
            className={`filter-chip ${securityFilter ? 'active-chip' : ''}`}
            onClick={() => setSecurityFilter(!securityFilter)}
          >
            <span>Security</span>
          </button>

          <button type="button" className="filter-chip">
            <span>Comfort</span>
          </button>
        </div>

        {/* Section title */}
        <h2 className="nearby-spots-title">Nearby Spots</h2>

        {/* Spots Card Lists */}
        <div className="spots-cards-list">
          {filteredSpots.length > 0 ? (
            filteredSpots.map(spot => (
              <div 
                className="spot-card clickable-spot-card" 
                key={spot.id}
                onClick={() => onSelectSpot && onSelectSpot(spot)}
                style={{ cursor: 'pointer' }}
              >
                {/* Spot Card Image & badges */}
                <div className="spot-card-media">
                  <img src={spot.image} alt={spot.title} className="spot-image" />
                  
                  {/* Overlay Badges */}
                  <div className="spot-badges-overlay">
                    {spot.verified && (
                      <span className="badge badge-verify">
                        <CheckCircle2 size={12} className="badge-icon-left text-orange" />
                        <span>Verified</span>
                      </span>
                    )}

                    {spot.cctv && (
                      <span className="badge badge-cctv">
                        <Video size={12} className="badge-icon-left text-orange" />
                        <span>CCTV</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Spot Card Details */}
                <div className="spot-card-info">
                  <div className="info-main-row">
                    <h3 className="spot-card-title">{spot.title}</h3>
                    <div className="spot-card-price">
                      <span className="price-val">₹{spot.price}</span>
                      <span className="price-unit">per hour</span>
                    </div>
                  </div>

                  <p className="spot-card-metadata">
                    {spot.distance} • {spot.type}
                  </p>

                  <div className="spot-card-rating">
                    <Star size={14} className="star-icon-filled" />
                    <span className="rating-score">{spot.rating}</span>
                    <span className="reviews-count">({spot.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="spots-empty-state">
              <p>No parking spots match your filters.</p>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => { setSearchQuery(''); setCctvFilter(false); setSecurityFilter(false); }}
                style={{ width: 'auto', marginTop: '12px' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Floating Action Map Button */}
        <button type="button" className="floating-map-btn" aria-label="Open map view">
          <Map size={24} className="fab-map-icon" />
        </button>
      </>
    );
  };

  const renderBookingsContent = () => (
    <div className="subtab-container">
      <h2 className="subtab-title">My Bookings</h2>
      
      {/* Active Newly Created Booking Row */}
      {activeBooking && (
        <div className="booking-card new-booking-glow">
          <div className="booking-status active">ACTIVE</div>
          <h3>{activeBooking.spot.title}</h3>
          <p className="booking-time">Oct 24 - Oct 25 (10:00 AM - 01:00 PM)</p>
          <span className="booking-price">₹{activeBooking.price} paid</span>
        </div>
      )}

      <div className="booking-card">
        <div className="booking-status active">ACTIVE</div>
        <h3>12 Khader Nawaz Khan Road</h3>
        <p className="booking-time">Today, 2:00 PM - 5:00 PM</p>
        <span className="booking-price">₹240.00 paid</span>
      </div>
      <div className="booking-card past">
        <div className="booking-status past-status">COMPLETED</div>
        <h3>T. Nagar Multi-Level Parking</h3>
        <p className="booking-time">Yesterday, 10:00 AM - 12:00 PM</p>
        <span className="booking-price">₹240.00 paid</span>
      </div>
    </div>
  );

  const renderMessagesContent = () => (
    <div className="subtab-container">
      <h2 className="subtab-title">Messages</h2>
      
      <div className="booking-card" style={{ cursor: 'pointer', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80" 
            alt="Sarah W. Avatar" 
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-border)' }}
          />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '750', color: 'var(--color-brand)' }}>Sarah W.</h3>
              <span style={{ fontSize: '10px', color: '#a0aec0', fontWeight: '600' }}>10:42 AM</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#718096', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Sure, the parking gate code is #4024. Let me know if you need help finding...
            </p>
          </div>
        </div>
      </div>

      <div className="booking-card" style={{ cursor: 'pointer', padding: '16px', opacity: 0.85 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(11, 46, 92, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justify: 'center',
            color: 'var(--color-brand)',
            fontSize: '12px',
            fontWeight: '800',
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            lineHeight: '42px'
          }}>
            PK
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '750', color: 'var(--color-brand)' }}>PARKEE Support</h3>
              <span style={{ fontSize: '10px', color: '#a0aec0', fontWeight: '600' }}>Yesterday</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#718096', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Your account verification check has been successfully completed. You may now...
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'home': return renderHomeContent();
      case 'bookings': return renderBookingsContent();
      case 'messages': return renderMessagesContent();
      case 'profile':
        return (
          <UserProfile 
            currentUser={currentUser}
            onBack={() => setActiveTab('home')} 
            onLogout={onLogout} 
            onSwitchToHost={onSwitchToHost} 
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      default: return renderHomeContent();
    }
  };

  return (
    <div className="home-dashboard-wrapper">
      {/* Top Application Bar - hidden on Profile tab */}
      {activeTab !== 'profile' && (
        <header className="home-top-bar">
          <div className="home-logo-wrap">
            <Logo size="small" showText={false} />
            <span className="home-brand-title">PARKEE</span>
          </div>
          <button type="button" className="profile-avatar-btn" onClick={() => setActiveTab('profile')}>
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" 
              alt="User profile menu" 
              className="user-profile-avatar"
            />
          </button>
        </header>
      )}

      {/* Dynamic Body Content */}
      <div className={`home-tab-content-body ${activeTab === 'profile' ? 'profile-body-full' : ''}`}>
        {renderTabContent()}
      </div>

      {/* Bottom Sticky Tab Navigation */}
      <footer className="home-bottom-navbar">
        <button 
          type="button" 
          className={`nav-tab-item ${activeTab === 'home' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Search size={20} className="tab-icon" />
          <span>Explore</span>
          {activeTab === 'home' && <div className="active-tab-indicator"></div>}
        </button>

        <button 
          type="button" 
          className={`nav-tab-item ${activeTab === 'bookings' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <ClipboardList size={20} className="tab-icon" />
          <span>Bookings</span>
          {activeTab === 'bookings' && <div className="active-tab-indicator"></div>}
        </button>

        <button 
          type="button" 
          className="nav-tab-item"
          onClick={onSwitchToHost}
        >
          <Car size={20} className="tab-icon" />
          <span>Host</span>
        </button>

        <button 
          type="button" 
          className={`nav-tab-item ${activeTab === 'messages' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={20} className="tab-icon" />
          <span>Messages</span>
          {activeTab === 'messages' && <div className="active-tab-indicator"></div>}
        </button>

        <button 
          type="button" 
          className={`nav-tab-item ${activeTab === 'profile' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} className="tab-icon" />
          <span>Profile</span>
          {activeTab === 'profile' && <div className="active-tab-indicator"></div>}
        </button>
      </footer>
    </div>
  );
}
