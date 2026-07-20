import React, { useState } from 'react';
import { ArrowLeft, MapPin, Video, Clock, ArrowRight, Camera, Plus, Trash2 } from 'lucide-react';
import mapPreview from '../assets/parking_map_mockup.png';

// Pre-defined mock images for simulating photo uploads
const MOCK_PARKING_IMAGES = [
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400'
];

export default function ListYourSpace({ onBack, onSubmit }) {
  const [address, setAddress] = useState('');
  const [photos, setPhotos] = useState([null, null, null, null, null]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [suitableFor, setSuitableFor] = useState('2-wheeler'); // '2-wheeler' | '4-wheeler' | 'both'
  const [price, setPrice] = useState('80.00');
  const [cctv, setCctv] = useState(true);
  const [selectedDay, setSelectedDay] = useState('MON 24');

  // Simulate file upload with loading indicator
  const handlePhotoClick = (index) => {
    if (photos[index]) {
      // Remove photo if already exists
      const updated = [...photos];
      updated[index] = null;
      setPhotos(updated);
      return;
    }

    setUploadingIndex(index);

    // Simulate network delay
    setTimeout(() => {
      const updated = [...photos];
      updated[index] = MOCK_PARKING_IMAGES[index % MOCK_PARKING_IMAGES.length];
      setPhotos(updated);
      setUploadingIndex(null);
    }, 600);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Please enter a location/address');
      return;
    }

    const newSpot = {
      id: Date.now(),
      title: address,
      distance: '0.1 km away',
      type: suitableFor === '2-wheeler' ? 'Driveway (Scooter)' : suitableFor === '4-wheeler' ? 'Garage' : 'Driveway',
      price: parseFloat(price || '0').toFixed(2),
      rating: '5.0',
      reviews: 1,
      verified: false,
      cctv: cctv,
      security: false,
      image: photos[0] || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600'
    };

    onSubmit(newSpot);
  };

  const daysList = [
    { label: 'MON', date: '24' },
    { label: 'TUE', date: '25' },
    { label: 'WED', date: '26' },
    { label: 'THU', date: '27' }
  ];

  return (
    <div className="login-screen-animation list-space-wrapper">
      {/* Header */}
      <div className="verify-nav-header list-space-header">
        <button type="button" className="btn-back-link" onClick={onBack} aria-label="Go back to dashboard">
          <ArrowLeft size={22} className="back-arrow-icon" />
        </button>
        <span className="verify-nav-title">List Your Space</span>
        <div className="status-dot-active"></div>
      </div>

      <form id="list-space-form" onSubmit={handleFormSubmit} className="list-space-container">

        {/* Section 1: Location */}
        <div className="list-form-section">
          <label className="list-section-title">Where is your space located?</label>
          <div className="list-address-input-wrapper">
            <MapPin size={18} className="list-address-icon" />
            <input
              type="text"
              placeholder="Enter full address or postcode"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="list-address-field"
              required
            />
          </div>
          <div className="list-map-preview-container">
            <img src={mapPreview} alt="Map Location Guide" className="list-map-image" />
          </div>
        </div>

        {/* Section 2: Photos */}
        <div className="list-form-section">
          <div className="list-photos-header">
            <label className="list-section-title">Add Photos</label>
            <span className="list-sub-label">Up to 5 photos</span>
          </div>

          <div className="photos-grid-layout">
            {/* Primary Photo Slot */}
            <div
              className={`primary-photo-slot ${photos[0] ? 'has-image' : ''} ${uploadingIndex === 0 ? 'uploading' : ''}`}
              onClick={() => handlePhotoClick(0)}
            >
              {uploadingIndex === 0 ? (
                <div className="photo-spinner"></div>
              ) : photos[0] ? (
                <>
                  <img src={photos[0]} alt="Primary space" className="photo-card-img" />
                  <div className="delete-photo-overlay">
                    <Trash2 size={16} />
                  </div>
                </>
              ) : (
                <div className="primary-photo-placeholder">
                  <Camera size={26} className="camera-placeholder-icon" />
                  <span className="primary-photo-text">Primary Photo</span>
                </div>
              )}
            </div>

            {/* Smaller Slots */}
            <div className="smaller-photos-grid">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`small-photo-slot ${photos[index] ? 'has-image' : ''} ${uploadingIndex === index ? 'uploading' : ''}`}
                  onClick={() => handlePhotoClick(index)}
                >
                  {uploadingIndex === index ? (
                    <div className="photo-spinner-small"></div>
                  ) : photos[index] ? (
                    <>
                      <img src={photos[index]} alt={`Upload space ${index}`} className="photo-card-img" />
                      <div className="delete-photo-overlay">
                        <Trash2 size={12} />
                      </div>
                    </>
                  ) : (
                    <Plus size={20} className="plus-placeholder-icon" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Vehicle Suitability */}
        <div className="list-form-section">
          <label className="list-section-title">Suitable for</label>
          <div className="vehicle-suitability-row">
            <button
              type="button"
              className={`suitability-chip ${suitableFor === '2-wheeler' ? 'active' : ''}`}
              onClick={() => setSuitableFor('2-wheeler')}
            >
              {/* Scooter SVG */}
              <svg className="suitability-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1h-2" />
                <circle cx="5" cy="18" r="3" />
                <circle cx="19" cy="18" r="3" />
                <path d="M5 15h11a3 3 0 0 0 3-3V7.5L16.5 4H14" />
                <path d="M8 15V8" />
              </svg>
              <span>2-wheeler</span>
            </button>

            <button
              type="button"
              className={`suitability-chip ${suitableFor === '4-wheeler' ? 'active' : ''}`}
              onClick={() => setSuitableFor('4-wheeler')}
            >
              {/* Car SVG */}
              <svg className="suitability-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="10" width="20" height="9" rx="2" />
                <path d="M6 10V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" />
                <circle cx="6" cy="14" r="1.5" />
                <circle cx="18" cy="14" r="1.5" />
              </svg>
              <span>4-wheeler</span>
            </button>

            <button
              type="button"
              className={`suitability-chip ${suitableFor === 'both' ? 'active' : ''}`}
              onClick={() => setSuitableFor('both')}
            >
              {/* Double Vehicles SVG */}
              <svg className="suitability-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 11V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
                <rect x="2" y="11" width="10" height="6" rx="1" />
                <circle cx="5" cy="14" r="1" />
                <circle cx="9" cy="14" r="1" />
                <circle cx="18" cy="14" r="2" />
                <path d="M14 12V9.5h3" />
              </svg>
              <span>Both</span>
            </button>
          </div>
        </div>

        {/* Section 4: Price per hour */}
        <div className="list-form-section">
          <label className="list-section-title">Price per hour</label>
          <div className="list-price-input-wrapper">
            <span className="price-currency-symbol">₹</span>
            <input
              type="number"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="list-price-field"
              required
            />
          </div>
        </div>

        {/* Section 5: CCTV Toggle */}
        <div className="list-form-section list-toggle-section">
          <div className="toggle-info-row">
            <div className="toggle-icon-wrap">
              <Video size={20} className="toggle-cctv-icon" />
            </div>
            <div className="toggle-text-wrap">
              <span className="toggle-title">CCTV</span>
              <span className="toggle-subtitle font-sm">Security available</span>
            </div>
          </div>
          <label className="standard-switch-label">
            <input
              type="checkbox"
              checked={cctv}
              onChange={(e) => setCctv(e.target.checked)}
              className="checkbox-input-hidden"
            />
            <span className="switch-slider-visual"></span>
          </label>
        </div>

        {/* Section 6: Available Time Slots */}
        <div className="list-form-section">
          <div className="list-time-header">
            <label className="list-section-title">Available Time Slots</label>
            <button type="button" className="btn-customise-slots">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}>
                <path d="M21 4H3M21 12H3M21 20H3M12 4v16" />
              </svg>
              <span>Customise</span>
            </button>
          </div>

          {/* Days Pills Row */}
          <div className="days-pills-scroll-row">
            {daysList.map((day) => {
              const dayStr = `${day.label} ${day.date}`;
              const isSelected = selectedDay === dayStr;
              return (
                <button
                  key={dayStr}
                  type="button"
                  className={`day-card-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedDay(dayStr)}
                >
                  <span className="day-name">{day.label}</span>
                  <span className="day-date">{day.date}</span>
                </button>
              );
            })}
          </div>

          {/* Everyday banner */}
          <div className="everyday-alert-banner">
            <Clock size={16} className="clock-everyday-icon" />
            <div className="everyday-message-right">
              <span className="everyday-main-time">Everyday: 08:00 - 20:00</span>
              <span className="everyday-sub-message">Standard availability applied to selected days</span>
            </div>
          </div>
        </div>

        {/* Submit Listing Button — inside form, full width */}
        <button
          type="submit"
          style={{
            height: '58px',
            fontSize: '16px',
            fontWeight: '800',
            borderRadius: '16px',
            letterSpacing: '0.3px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            backgroundColor: '#006C35',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 4px 16px rgba(0, 108, 53, 0.3)',
            cursor: 'pointer',
            marginTop: '8px',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <span>Submit listing</span>
          <ArrowRight size={20} />
        </button>

      </form>
    </div>
  );
}
