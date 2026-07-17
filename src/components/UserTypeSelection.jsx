import React from 'react';
import { ArrowLeft, Car, Home, ChevronRight } from 'lucide-react';
import Logo from './Logo';

export default function UserTypeSelection({ onSelectType, onBack, isLoggedIn }) {
  return (
    <div className="login-screen-animation select-usertype-wrapper">
      {/* Navigation Header — hidden after login */}
      {!isLoggedIn && (
        <div className="verify-nav-header">
          <button type="button" className="btn-back-link" onClick={onBack} aria-label="Go back to verification">
            <ArrowLeft size={22} className="back-arrow-icon" />
          </button>
          <span className="verify-nav-title">PARKEE</span>
          <div style={{ width: '22px' }}></div>
        </div>
      )}

      {/* When logged in show a centred title bar without a back arrow */}
      {isLoggedIn && (
        <div className="verify-nav-header" style={{ justifyContent: 'center' }}>
          <span className="verify-nav-title">PARKEE</span>
        </div>
      )}

      <div className="verify-container">
        {/* Logo and Greeting */}
        <div className="verify-brand-logo">
          <Logo size="small" showText={true} />
        </div>

        <h1 className="usertype-title text-center">Welcome to PARKEE</h1>
        <p className="usertype-subtitle text-center">
          How would you like to use the app today?
        </p>

        {/* Option Selection Cards */}
        <div className="usertype-cards-list">
          {/* Card 1: Need Parking */}
          <button 
            type="button" 
            className="usertype-card" 
            onClick={() => onSelectType('parker')}
          >
            <div className="usertype-icon-container bg-navy">
              <Car size={26} className="usertype-icon text-white" />
            </div>
            
            <div className="usertype-text-content">
              <h3>I need parking</h3>
              <p>Find and book convenient parking spots near you.</p>
            </div>
            
            {/* Hide chevron arrow after login */}
            {!isLoggedIn && <ChevronRight size={20} className="usertype-chevron" />}
          </button>

          {/* Card 2: Have Space to Rent */}
          <button 
            type="button" 
            className="usertype-card" 
            onClick={() => onSelectType('host')}
          >
            <div className="usertype-icon-container bg-lightgreen">
              <Home size={26} className="usertype-icon text-darkgreen" />
            </div>
            
            <div className="usertype-text-content">
              <h3>I have space to rent</h3>
              <p>List your driveway or garage and start earning.</p>
            </div>
            
            {/* Hide chevron arrow after login */}
            {!isLoggedIn && <ChevronRight size={20} className="usertype-chevron" />}
          </button>
        </div>

        {/* Footer switcher note */}
        <p className="usertype-footer-note text-center">
          You can switch between renting and hosting anytime from your profile.
        </p>
      </div>
    </div>
  );
}
