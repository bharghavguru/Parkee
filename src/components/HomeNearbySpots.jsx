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
  CreditCard,
  Wallet,
  Plus,
  Minus,
  Target,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import Logo from './Logo';
import UserProfile from './UserProfile';
import chennaiMap from '../assets/chennai_styled_map.png';

export default function HomeNearbySpots({ currentUser, onLogout, onSwitchToHost, onSelectSpot, activeBooking, initialTab = 'home', spots }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab); // 'home' | 'bookings' | 'messages' | 'profile'
  const [cctvFilter, setCctvFilter] = useState(false);
  const [securityFilter, setSecurityFilter] = useState(false);

  // New Map & Bottom Sheet States
  const [mapZoom, setMapZoom] = useState('out'); // 'out' | 'in'
  const [sheetHeight, setSheetHeight] = useState('half'); // 'collapsed' | 'half' | 'full'
  const [selectedMapSpot, setSelectedMapSpot] = useState(1);

  // Core Central Chennai Spots definition matching User localization requirements
  const chennaiSpots = [
    {
      id: 1,
      title: '12 Khader Nawaz Khan Road',
      distance: '0.2 km away',
      type: 'Driveway',
      price: '80.00',
      rating: '4.9',
      reviews: 128,
      verified: true,
      cctv: true,
      security: true,
      instant: true,
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=400',
      left: '60%', 
      top: '40%'
    },
    {
      id: 2,
      title: 'T. Nagar Multi-Level Parking',
      distance: '0.8 km away',
      type: 'Garage',
      price: '120.00',
      rating: '4.8',
      reviews: 94,
      verified: true,
      cctv: true,
      security: true,
      instant: true,
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400',
      left: '25%', 
      top: '35%'
    },
    {
      id: 3,
      title: 'Adyar Private Car Park',
      distance: '2.1 km away',
      type: 'Driveway',
      price: '60.00',
      rating: '4.6',
      reviews: 43,
      verified: false,
      cctv: false,
      security: false,
      instant: false,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400',
      left: '70%', 
      top: '68%'
    }
  ];

  // Map user host spots to Chennai coordinates to show live synchronization support
  const customSpots = (spots || []).map((spot, i) => {
    if (spot.left) return spot;
    return {
      ...spot,
      instant: true,
      left: `${42 + (i * 8)}%`,
      top: `${52 - (i * 6)}%`
    };
  });

  const allChennaiSpots = [...chennaiSpots, ...customSpots.filter(cs => cs.id > 3)];

  // Spot Mock Data
  const allSpots = spots || [
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
    const filteredChennaiSpots = allChennaiSpots.filter(spot => {
      const matchesSearch = spot.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCctv = !cctvFilter || spot.cctv;
      const matchesSecurity = !securityFilter || spot.security;
      return matchesSearch && matchesCctv && matchesSecurity;
    });

    const activeSpot = filteredChennaiSpots.find(s => s.id === selectedMapSpot) || filteredChennaiSpots[0] || allChennaiSpots[0];

    const toggleSheetHeight = () => {
      if (sheetHeight === 'collapsed') setSheetHeight('half');
      else if (sheetHeight === 'half') setSheetHeight('full');
      else setSheetHeight('collapsed');
    };

    return (
      <div className="map-view-layout">
        
        {/* Floating Search Bar */}
        <div className="map-search-bar-floating">
          <div className="search-bar-inner">
            <Search size={18} className="search-icon-left" />
            <input 
              type="text" 
              placeholder="Where to? Near Nungambakkam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
              aria-label="Where to search Input"
            />
            <button 
              type="button" 
              className="btn-map-filter-control" 
              onClick={() => setCctvFilter(!cctvFilter)}
              title="Toggle Security Filters"
            >
              <SlidersHorizontal size={18} style={{ color: 'var(--color-brand)' }} />
            </button>
          </div>
        </div>

        {/* Map Viewport */}
        <div className={`map-viewport zoom-${mapZoom}`}>
          <div className="map-canvas-container">
            <img src={chennaiMap} alt="Central Chennai Map Background" className="london-map-image" />
            
            {/* --- Zoomed Out Clusters --- */}
            {mapZoom === 'out' && (
              <>
                <button 
                  type="button"
                  className="map-cluster-badge cluster-1"
                  onClick={() => { setMapZoom('in'); setSelectedMapSpot(1); }}
                >
                  <span>12</span>
                </button>
                
                <button 
                  type="button"
                  className="map-cluster-badge cluster-2"
                  onClick={() => { setMapZoom('in'); setSelectedMapSpot(3); }}
                >
                  <span>5</span>
                </button>
              </>
            )}

            {/* --- Zoomed In Individual Pins --- */}
            {mapZoom === 'in' && (
              <>
                {filteredChennaiSpots.map(spot => {
                  const isSelected = spot.id === selectedMapSpot;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      className={`map-price-pin-marker ${isSelected ? 'selected' : ''}`}
                      style={{ left: spot.left, top: spot.top }}
                      onClick={() => setSelectedMapSpot(spot.id)}
                    >
                      <span className="price-pin-txt">₹{spot.price}</span>
                      <div className="price-pin-pointer"></div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Floating Navigation Controls */}
        <div className="map-floating-navigation">
          <button 
            type="button" 
            className="btn-floating-nav-control" 
            onClick={() => setMapZoom(mapZoom === 'out' ? 'in' : 'out')}
            title="Toggle Zoom"
          >
            {mapZoom === 'out' ? <Plus size={20} /> : <Minus size={20} />}
          </button>

          <button 
            type="button" 
            className="btn-floating-nav-control" 
            onClick={() => {
              setMapZoom('in');
              setSelectedMapSpot(1);
            }}
            title="Find My Location"
          >
            <Target size={20} />
          </button>
        </div>

        {/* Swipeable Bottom Sheet */}
        <div className={`discovery-bottom-sheet height-${sheetHeight}`}>
          
          <div className="bottom-sheet-drag-handle-wrap" onClick={toggleSheetHeight}>
            <div className="bottom-sheet-drag-handle"></div>
          </div>

          <div className="bottom-sheet-header-row">
            <div className="header-left-headings">
              <h3 className="bottom-sheet-main-title">Nearby Parking</h3>
              <span className="bottom-sheet-subtitle">{filteredChennaiSpots.length} spots available near you</span>
            </div>
            <button 
              type="button" 
              className="bottom-sheet-btn-view-list"
              onClick={() => setSheetHeight(sheetHeight === 'full' ? 'half' : 'full')}
            >
              {sheetHeight === 'full' ? 'Collapse' : 'View List'}
            </button>
          </div>

          <div className="bottom-sheet-scrollable-body">
            {sheetHeight === 'full' ? (
              <div className="full-list-layout-wrapper">
                {filteredChennaiSpots.map(spot => (
                  <div 
                    key={spot.id} 
                    className={`spot-list-preview-card ${spot.id === selectedMapSpot ? 'active-highlight' : ''}`}
                    onClick={() => {
                      setSelectedMapSpot(spot.id);
                      setSheetHeight('half');
                    }}
                  >
                    <img src={spot.image} alt={spot.title} className="spot-preview-card-img" />
                    <div className="spot-preview-card-info">
                      <div className="card-title-row">
                        <span className="card-location-title">{spot.title}</span>
                        {spot.instant && <span className="card-badge-instant">INSTANT</span>}
                      </div>
                      <p className="card-sub-metadata">{spot.distance} • CCTV</p>
                      <div className="card-rating-price-row">
                        <div className="card-rating-wrap">
                          <Star size={12} className="star-card-icon" />
                          <span className="card-rating-number">{spot.rating}</span>
                          <span className="card-rating-reviews">({spot.reviews})</span>
                        </div>
                        <span className="card-rate-label">₹{spot.price}<span className="card-rate-hr">/hr</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              activeSpot && (
                <div 
                  className="spot-single-preview-card"
                  onClick={() => onSelectSpot && onSelectSpot(activeSpot)}
                >
                  <img src={activeSpot.image} alt={activeSpot.title} className="spot-preview-card-img" />
                  <div className="spot-preview-card-info">
                    <div className="card-title-row">
                      <span className="card-location-title">{activeSpot.title}</span>
                      {activeSpot.instant && <span className="card-badge-instant">INSTANT</span>}
                    </div>
                    <p className="card-sub-metadata">{activeSpot.distance} • CCTV</p>
                    <div className="card-rating-price-row">
                      <div className="card-rating-wrap">
                        <Star size={12} className="star-card-icon" />
                        <span className="card-rating-number">{activeSpot.rating}</span>
                        <span className="card-rating-reviews">({activeSpot.reviews})</span>
                      </div>
                      <span className="card-rate-label">₹{activeSpot.price}<span className="card-rate-hr">/hr</span></span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

      </div>
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

  const renderWalletContent = () => {
    return (
      <div className="subtab-container" style={{ padding: '0 8px' }}>
        <h2 className="subtab-title">My Wallet</h2>
        
        {/* Wallet Balance Card mockup */}
        <div className="wallet-balance-card" style={{ margin: '0 0 24px 0', background: 'var(--color-brand)', color: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', textAlign: 'left' }}>
          <span className="wallet-bal-lbl" style={{ opacity: 0.8, fontSize: '11px', fontWeight: '750', letterSpacing: '0.8px' }}>AVAILABLE BALANCE</span>
          <h3 style={{ fontSize: '32px', margin: '8px 0 20px 0', fontWeight: '800' }}>₹500.00</h3>
          <button type="button" className="btn btn-primary btn-block" style={{ background: 'var(--color-green)', color: '#ffffff', borderRadius: '12px', height: '42px', fontSize: '14px', fontWeight: '700', border: 'none' }}>
            Add Cash
          </button>
        </div>

        <h3 className="section-subtitle" style={{ textAlign: 'left', fontSize: '15px', fontWeight: '800', color: 'var(--color-brand)', marginBottom: '12px' }}>
          Saved Payment Methods
        </h3>
        
        <div className="saved-card-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
          <CreditCard size={20} className="card-icon" style={{ color: 'var(--color-brand)' }} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--color-brand)' }}>Visa ending in 4242</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>Expires 12/28</p>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'home': return renderHomeContent();
      case 'bookings': return renderBookingsContent();
      case 'wallet': return renderWalletContent();
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
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
              alt="User profile menu" 
              className="user-profile-avatar"
            />
          </button>
        </header>
      )}

      {/* Dynamic Body Content */}
      <div className={`home-tab-content-body ${activeTab === 'profile' ? 'profile-body-full' : ''} ${activeTab === 'home' ? 'map-body-full' : ''}`}>
        {renderTabContent()}
      </div>

      {/* Bottom Sticky Tab Navigation */}
      <footer className="home-bottom-navbar">
        <button 
          type="button" 
          className={`nav-tab-item ${activeTab === 'home' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <MapPin size={20} className="tab-icon" />
          <span>Home</span>
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
          className={`nav-tab-item ${activeTab === 'wallet' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <Wallet size={20} className="tab-icon" />
          <span>Wallet</span>
          {activeTab === 'wallet' && <div className="active-tab-indicator"></div>}
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
