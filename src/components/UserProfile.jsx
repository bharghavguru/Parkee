import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Check, 
  Car, 
  CreditCard, 
  SquarePen, 
  PlusCircle, 
  Home, 
  Coins, 
  Star, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight,
  CheckCircle2,
  Wallet
} from 'lucide-react';

export default function UserProfile({ onBack, onLogout, onSwitchToHost, onNavigateTab }) {
  const [subPage, setSubPage] = useState(null); // null | 'wallet'
  const [balance, setBalance] = useState(45.20);
  const [topupAmount, setTopupAmount] = useState('');
  const [isTopupOpen, setIsTopupOpen] = useState(false);

  const handleAddCash = (e) => {
    e.preventDefault();
    const parsed = parseFloat(topupAmount);
    if (!isNaN(parsed) && parsed > 0) {
      setBalance(prev => prev + parsed);
      setTopupAmount('');
      setIsTopupOpen(false);
    }
  };

  // If subPage is 'wallet', render the balance view (historically the 3rd bottom tab, now obsolete as tab)
  if (subPage === 'wallet') {
    return (
      <div className="login-screen-animation user-profile-wrapper">
        <header className="profile-header-bar">
          <button type="button" className="btn-back-link" onClick={() => setSubPage(null)} aria-label="Go back to profile menu">
            <ArrowLeft size={22} className="back-arrow-icon" />
          </button>
          <span className="profile-header-title">Wallet & payments</span>
          <div style={{ width: '22px' }}></div>
        </header>

        <div className="profile-scroll-content" style={{ padding: '20px 16px' }}>
          {/* Restored Wallet Card Mockup */}
          <div className="wallet-balance-card" style={{ margin: '0 0 24px 0' }}>
            <span className="wallet-bal-lbl">AVAILABLE BALANCE</span>
            <h3 style={{ fontSize: '32px', margin: '8px 0 20px 0', fontWeight: '800' }}>£{balance.toFixed(2)}</h3>
            
            {!isTopupOpen ? (
              <button 
                type="button" 
                className="btn btn-primary btn-block wallet-topup-btn"
                onClick={() => setIsTopupOpen(true)}
              >
                Add Cash
              </button>
            ) : (
              <form onSubmit={handleAddCash} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Amount (£)"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="search-input-field"
                  style={{ background: '#ffffff', color: '#0b2e5c', border: '1px solid var(--color-border)', borderRadius: '10px', height: '40px', padding: '0 12px', fontSize: '13px', flex: 1 }}
                  required
                  aria-label="Add cash amount input field"
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', height: '40px', fontSize: '12px', borderRadius: '10px', width: 'auto' }}>
                  Confirm
                </button>
              </form>
            )}
          </div>

          <h3 className="section-subtitle" style={{ textAlign: 'left', fontSize: '15px', fontWeight: '800', color: 'var(--color-brand)', marginBottom: '12px' }}>
            Saved Methods
          </h3>
          
          <div className="saved-card-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
            <CreditCard size={20} className="card-icon" style={{ color: 'var(--color-brand)' }} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--color-brand)' }}>Visa ending in 4242</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>Expires 12/28</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen-animation user-profile-wrapper">
      {/* Profile Header */}
      <header className="profile-header-bar">
        <button type="button" className="btn-back-link" onClick={onBack} aria-label="Go back to search">
          <ArrowLeft size={22} className="back-arrow-icon" />
        </button>
        <span className="profile-header-title">Profile</span>
        <button type="button" className="profile-settings-btn" aria-label="Settings configuration">
          <Settings size={22} />
        </button>
      </header>

      {/* Profile content list scroll container */}
      <div className="profile-scroll-content">
        
        {/* Profile Avatar and Name Card */}
        <div className="profile-identity-card">
          <div className="profile-photo-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" 
              alt="Alex Johnson Profile" 
              className="profile-lg-photo"
            />
            {/* Green verification symbol circle overlay */}
            <div className="photo-verified-badge-overlay">
              <Check size={12} className="white-check-icon" />
            </div>
          </div>

          <h2 className="profile-user-fullname">Alex Johnson</h2>
          <span className="profile-user-phonelabel">+44 7700 900123</span>
          
          {/* Verified Badge pill */}
          <div className="profile-verified-badge-pill">
            <CheckCircle2 size={12} className="verified-pill-icon" />
            <span>Verified</span>
          </div>
        </div>

        {/* Rating and counts statistics card */}
        <div className="profile-stats-card">
          <div className="stats-col-cell">
            <span className="stats-cell-num">
              4.9 <span className="stats-star-char">★</span>
            </span>
            <span className="stats-cell-label">Overall Rating</span>
          </div>

          <div className="stats-divider-vertical"></div>

          <div className="stats-col-cell">
            <span className="stats-cell-num">12</span>
            <span className="stats-cell-label">Bookings</span>
          </div>

          <div className="stats-divider-vertical"></div>

          <div className="stats-col-cell">
            <span className="stats-cell-num">3</span>
            <span className="stats-cell-label">Listings</span>
          </div>
        </div>

        {/* Renter section list */}
        <div className="profile-group-wrapper">
          <h3 className="profile-group-subtitle">As a renter</h3>
          
          <div className="profile-list-links">
            <button 
              type="button" 
              className="list-option-row"
              onClick={() => onNavigateTab && onNavigateTab('bookings')}
            >
              <div className="list-row-left">
                <Car size={18} className="list-row-icon" />
                <span>My bookings</span>
              </div>
              <ChevronRight size={16} className="list-chevron-icon" />
            </button>

            <button 
              type="button" 
              className="list-option-row"
              onClick={() => setSubPage('wallet')}
            >
              <div className="list-row-left">
                <CreditCard size={18} className="list-row-icon" />
                <span>Wallet & payments</span>
              </div>
              <ChevronRight size={16} className="list-chevron-icon" />
            </button>

            <button type="button" className="list-option-row">
              <div className="list-row-left">
                <SquarePen size={18} className="list-row-icon" />
                <span>Reviews I've given</span>
              </div>
              <ChevronRight size={16} className="list-chevron-icon" />
            </button>
          </div>
        </div>

        {/* Host section list */}
        <div className="profile-group-wrapper">
          <h3 className="profile-group-subtitle">As a host</h3>

          {/* Add a new listing green button */}
          <button type="button" className="btn-add-listing-emerald" onClick={onSwitchToHost}>
            <PlusCircle size={20} className="add-listing-icon" />
            <span>Add a new listing</span>
          </button>
          
          <div className="profile-list-links">
            <button type="button" className="list-option-row" onClick={onSwitchToHost}>
              <div className="list-row-left">
                <Home size={18} className="list-row-icon" />
                <span>My listings</span>
              </div>
              <ChevronRight size={16} className="list-chevron-icon" />
            </button>

            <button type="button" className="list-option-row" onClick={onSwitchToHost}>
              <div className="list-row-left">
                <Coins size={18} className="list-row-icon" />
                <span>Earnings & payouts</span>
              </div>
              <ChevronRight size={16} className="list-chevron-icon" />
            </button>

            <button type="button" className="list-option-row" onClick={onSwitchToHost}>
              <div className="list-row-left">
                <Star size={18} className="list-row-icon" />
                <span>Reviews I've received</span>
              </div>
              <ChevronRight size={16} className="list-chevron-icon" />
            </button>
          </div>
        </div>

        {/* Global actions separator space */}
        <div className="profile-space-separator"></div>

        {/* Common general options list */}
        <div className="profile-list-links common-list-box">
          <button type="button" className="list-option-row">
            <div className="list-row-left">
              <ShieldCheck size={18} className="list-row-icon" />
              <span>KYC verification</span>
            </div>
            <div className="list-row-right-status">
              <CheckCircle2 size={16} className="kyc-success-badge-icon" />
              <ChevronRight size={16} className="list-chevron-icon" />
            </div>
          </button>

          <button type="button" className="list-option-row">
            <div className="list-row-left">
              <HelpCircle size={18} className="list-row-icon" />
              <span>Help & support</span>
            </div>
            <ChevronRight size={16} className="list-chevron-icon" />
          </button>

          <button type="button" className="list-option-row">
            <div className="list-row-left">
              <Settings size={18} className="list-row-icon" />
              <span>Settings</span>
            </div>
            <ChevronRight size={16} className="list-chevron-icon" />
          </button>
        </div>

        {/* Logout panel action */}
        <div className="profile-logout-footer">
          <button type="button" className="btn-logout-link-red" onClick={onLogout}>
            Log out
          </button>
          <span className="profile-software-version">Version 2.4.1 (612)</span>
        </div>

      </div>
    </div>
  );
}
