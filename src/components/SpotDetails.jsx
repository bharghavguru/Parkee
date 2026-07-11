import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Video, 
  Home, 
  ShieldAlert, 
  Zap, 
  Star, 
  CornerUpRight,
  ArrowRight
} from 'lucide-react';
import Logo from './Logo';

export default function SpotDetails({ spot, onBack, onBookNow }) {
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback default details if spot is missing
  const activeSpot = spot || {
    title: '24 Kensington Court',
    distance: '0.2 miles away',
    type: 'Driveway',
    price: '4.50',
    rating: '4.9',
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600'
  };

  const hourRate = parseFloat(activeSpot.price);
  const total2Hours = (hourRate * 2).toFixed(2);
  const dayRate = (hourRate * 7.1).toFixed(0); // Simulates day scale calculation

  return (
    <div className="login-screen-animation spot-details-wrapper">
      {/* Visual Header */}
      <header className="details-header-bar">
        <button type="button" className="btn-back-link" onClick={onBack} aria-label="Go back to search">
          <ArrowLeft size={22} className="back-arrow-icon" />
        </button>
        <span className="details-header-title">PARKEE</span>
        <div className="details-header-actions">
          <button type="button" className="details-icon-btn" aria-label="Share spot">
            <Share2 size={20} />
          </button>
          <button 
            type="button" 
            className={`details-icon-btn ${isWishlisted ? 'wishlisted' : ''}`} 
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Add to wishlist"
          >
            <Heart size={20} fill={isWishlisted ? "#ff3366" : "none"} />
          </button>
        </div>
      </header>

      {/* Main scrolling details container */}
      <div className="details-scroll-content">
        {/* Main Photo Gallery Hero */}
        <div className="details-hero-gallery">
          <img src={activeSpot.image} alt={activeSpot.title} className="details-hero-image" />
          
          {/* Top right branding badge */}
          <div className="details-logo-badge">
            <Logo size="small" showText={false} />
          </div>

          {/* Dots Indicator Overlay */}
          <div className="carousel-dots-wrap">
            <span className="dot"></span>
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Title and pricing grid */}
        <div className="details-title-pricing-row">
          <div className="title-address-cell">
            <h1 className="details-spot-title">{activeSpot.title}</h1>
            <p className="details-spot-address">Kensington, London W8 5DL</p>
          </div>
          
          <div className="pricing-cell">
            <div className="price-hr-raw">
              <span className="price-hr-val">£{activeSpot.price}</span>
              <span className="price-hr-lbl">/hr</span>
            </div>
            <p className="price-day-raw">£{dayRate}/day</p>
          </div>
        </div>

        {/* Host Profile Info Card */}
        <div className="host-info-row-card">
          <div className="host-profile-wrap">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
              alt="Sarah W. Host" 
              className="host-avatar-img"
            />
            <div className="host-meta-details">
              <h3>Sarah W.</h3>
              <div className="host-rating-meta">
                <Star size={12} className="star-icon-filled" />
                <span>{activeSpot.rating}</span>
                <span className="host-rev-count">({activeSpot.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <button type="button" className="btn-message-host">
            Message
          </button>
        </div>

        {/* Facilities badging row */}
        <div className="facilities-chips-container">
          <span className="fac-chip fac-chip-cctv">
            <Video size={14} className="fac-icon text-orange" />
            <span>CCTV</span>
          </span>
          
          <span className="fac-chip">
            <Home size={14} className="fac-icon" />
            <span>Covered</span>
          </span>

          <span className="fac-chip">
            <ShieldAlert size={14} className="fac-icon" />
            <span>Gated</span>
          </span>

          <span className="fac-chip">
            <Zap size={14} className="fac-icon" />
            <span>EV Charging</span>
          </span>
        </div>

        {/* About section */}
        <div className="details-about-section">
          <h2>About this space</h2>
          <p>
            Spacious, secure driveway in the heart of Kensington. Perfect for shoppers and local residents. 24/7 access with security cameras. Minutes away from High Street Kensington Station.
          </p>
          <button type="button" className="lbl-read-more">Read more</button>
        </div>

        {/* Maps Section */}
        <div className="details-map-section">
          <h2>Location</h2>
          <div className="details-map-frame-mock">
            {/* SVG mockup representing a high-fidelity street map layout */}
            <svg viewBox="0 0 320 180" className="map-svg-drawing" xmlns="http://www.w3.org/2000/svg">
              <rect width="320" height="180" fill="#e8eff5" />
              {/* Streets paths */}
              <path d="M 0,90 Q 160,95 320,100" fill="none" stroke="#ffffff" strokeWidth="18" />
              <path d="M 120,0 L 140,180" fill="none" stroke="#ffffff" strokeWidth="14" />
              <path d="M 240,0 L 220,180" fill="none" stroke="#ffffff" strokeWidth="12" />
              
              {/* Street labels */}
              <text x="10" y="85" fill="#a0aec0" fontSize="7" fontWeight="bold" transform="rotate(1)">Kensington High Street</text>
              <text x="148" y="40" fill="#a0aec0" fontSize="7" fontWeight="bold" transform="rotate(82 148 40)">Kensington Court</text>

              {/* Parkee Location Pin Superimposed */}
              <g transform="translate(132, 85)">
                <circle cx="0" cy="0" r="14" fill="rgba(11, 46, 92, 0.2)" />
                <path d="M0 -12 C-6 -12 -10 -8 -10 0 C-10 10 0 18 0 18 C0 18 10 10 10 0 C10 -8 6 -12 0 -12 Z" fill="#0b2e5c" />
                <circle cx="0" cy="-2" r="4" fill="#ffffff" />
                <circle cx="0" cy="-2" r="1.5" fill="#0b2e5c" />
              </g>
            </svg>

            {/* Float directions button */}
            <button type="button" className="map-directions-float-btn">
              <CornerUpRight size={14} className="directions-arrow-icon" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        {/* Available Calendar / Times Section */}
        <div className="details-times-section">
          <div className="times-header-row">
            <h2>Available Times</h2>
            <button type="button" className="lbl-edit-date">Edit Date</button>
          </div>
          <p className="active-date-label">Today, Oct 24th</p>

          <div className="times-horizontal-chips">
            {['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'].map((timeStr) => (
              <button 
                type="button" 
                key={timeStr}
                className={`time-select-chip ${selectedTime === timeStr ? 'active' : ''}`}
                onClick={() => setSelectedTime(timeStr)}
              >
                {timeStr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Total & Action Bar */}
      <footer className="details-bottom-action-bar">
        <div className="total-accounting-box">
          <span className="total-lbl">Total (2 hours)</span>
          <span className="total-price-val">£{total2Hours}</span>
        </div>
        
        <button 
          type="button" 
          className="btn btn-primary btn-book-now-details"
          onClick={() => onBookNow(activeSpot)}
        >
          <span>Book now</span>
          <ArrowRight size={18} className="btn-icon-right" />
        </button>
      </footer>
    </div>
  );
}
