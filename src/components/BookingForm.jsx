import React, { useState } from 'react';
import { ArrowLeft, Clock, Calendar as CalendarIcon, ShieldAlert, CreditCard } from 'lucide-react';
import Logo from './Logo';

export default function BookingForm({ spot, onBack, onConfirmBooking }) {
  const [selectedRange, setSelectedRange] = useState(['24', '25']);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('01:00 PM');

  // Fallback defaults
  const activeSpot = spot || {
    title: '24 Kensington Court',
    price: '4.50',
  };

  const hourRate = parseFloat(activeSpot.price);
  
  // Calculate total price based on 3 hours difference
  const durationHours = 3;
  const totalPrice = (hourRate * durationHours).toFixed(2);

  return (
    <div className="login-screen-animation booking-form-wrapper">
      {/* Navigation Header */}
      <header className="verify-nav-header">
        <button type="button" className="btn-back-link" onClick={onBack} aria-label="Go back to details">
          <ArrowLeft size={22} className="back-arrow-icon" />
        </button>
        <span className="verify-nav-title">PARKEE</span>
        <div style={{ width: '22px' }}></div>
      </header>

      {/* Main scrolling content area */}
      <div className="booking-scroll-content">
        
        {/* Select Dates Calendar Section */}
        <div className="calendar-section-header">
          <h2 className="check-booking-section-title">Select Dates</h2>
          <span className="calendar-month-indicator">October 2024</span>
        </div>

        {/* Mock Calendar Grid Card */}
        <div className="calendar-grid-card">
          {/* Days abbreviations row */}
          <div className="calendar-days-abbr-row">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          {/* Days integers rows (replicating the mockup simplified split grid) */}
          <div className="calendar-days-grid">
            {/* Row 1 (Sept 29-30 grayed, Oct 1-5 active) */}
            <span className="day-grayed">29</span>
            <span className="day-grayed">30</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>

            {/* Row 2 (Oct 6-10 active) */}
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
            <span className="day-empty"></span>
            <span className="day-empty"></span>

            {/* Split dots grid spacers */}
            <div className="calendar-split-row-divider" style={{ gridColumn: 'span 7' }}>
              <span className="divider-dot"></span>
              <span className="divider-dot"></span>
              <span className="divider-dot"></span>
            </div>

            {/* Row 3 (Oct 21-27 showing active range capsule on 24-25) */}
            <span>21</span>
            <span>22</span>
            <span>23</span>
            
            {/* Capsule Day range 24 & 25 selection wrapper */}
            <div className="calendar-selected-range-capsule">
              <span className="range-day start-active">24</span>
              <span className="range-day end-active">25</span>
            </div>
            
            <span>26</span>
            <span>27</span>
          </div>
        </div>

        {/* Select Time Section */}
        <div className="select-time-header">
          <h2 className="check-booking-section-title">Select Time</h2>
        </div>

        <div className="time-pickers-row">
          {/* Start Time input block */}
          <div className="time-select-block">
            <span className="time-select-label">START TIME</span>
            <div className="time-selector-field">
              <input 
                type="text" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                aria-label="Start time input field"
              />
              <Clock size={16} className="time-field-clock-icon" />
            </div>
          </div>

          {/* End Time input block */}
          <div className="time-select-block">
            <span className="time-select-label">END TIME</span>
            <div className="time-selector-field">
              <input 
                type="text" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                aria-label="End time input field"
              />
              <Clock size={16} className="time-field-clock-icon" />
            </div>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="booking-summary-header">
          <h2 className="check-booking-section-title">Booking Summary</h2>
        </div>

        <div className="booking-summary-card">
          {/* Date Row */}
          <div className="summary-info-row">
            <div className="summary-icon-badge bg-light-blue">
              <CalendarIcon size={18} className="text-blue" />
            </div>
            <div className="summary-row-details">
              <span className="summary-row-title">SELECTED DATE</span>
              <span className="summary-row-value">Thursday, Oct 24</span>
            </div>
          </div>

          {/* Duration Row */}
          <div className="summary-info-row">
            <div className="summary-icon-badge bg-light-green">
              <Clock size={18} className="text-green-success" />
            </div>
            <div className="summary-row-details">
              <span className="summary-row-title">DURATION</span>
              <span className="summary-row-value">{durationHours} hours ({startTime} - {endTime})</span>
            </div>
          </div>

          {/* Horizontal line divider */}
          <hr className="summary-divider-line" />

          {/* Rate and Final Totals block */}
          <div className="summary-fees-row">
            <div className="fees-item">
              <span className="fee-lbl">RATE</span>
              <span className="fee-val">£{activeSpot.price}/hr</span>
            </div>

            <div className="fees-item align-right">
              <span className="fee-lbl">TOTAL PRICE</span>
              <span className="fee-val-total">£{totalPrice}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Checkout Button Footer panel overlay */}
      <footer className="booking-bottom-action-panel">
        <button 
          type="button" 
          className="btn btn-primary btn-confirm-pay"
          onClick={() => onConfirmBooking(activeSpot, totalPrice)}
        >
          <CreditCard size={18} className="btn-icon-left" />
          <span>Confirm & Pay</span>
        </button>
      </footer>
    </div>
  );
}
