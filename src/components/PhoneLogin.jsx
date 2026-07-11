import React, { useState } from 'react';
import { Mail, User, ChevronDown } from 'lucide-react';
import Logo from './Logo';

export default function PhoneLogin({ onSendOTP, onEmailLogin, onGuestLogin, onNavigateSignUp }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(false);

  // Format the Indian phone number as XXXXX XXXXX
  const handleChange = (e) => {
    setError(false);
    const rawVal = e.target.value.replace(/\D/g, '');
    let formatted = rawVal;
    if (rawVal.length > 5) {
      formatted = `${rawVal.slice(0, 5)} ${rawVal.slice(5, 10)}`;
    }
    // limit to 10 digits (plus 1 space = 11 characters)
    setPhoneNumber(formatted.slice(0, 11));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\s+/g, '');
    if (cleanNumber.length !== 10) {
      setError(true);
      return;
    }
    onSendOTP(`+91 ${phoneNumber}`);
  };

  return (
    <div className="login-screen-animation">
      {/* Brand header */}
      <div className="brand-header">
        <Logo size="small" showText={true} />
        <h1>Welcome to PARKEE</h1>
        <p className="subtitle">Enter your phone number to continue</p>
      </div>

      {/* Main interactive Card */}
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">PHONE NUMBER</label>
            <div className={`phone-input-wrapper ${error ? 'input-error animate-shake' : ''}`}>
              {/* Country selector */}
              <div className="country-selector">
                <span className="flag-emoji">🇮🇳</span>
                <span className="country-code">+91</span>
                <ChevronDown size={14} className="dropdown-arrow-icon" />
              </div>

              {/* Vertical divider */}
              <div className="input-divider"></div>

              {/* Number entry */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="98765 43210"
                className="phone-number-field"
                aria-label="Enter your 10 digit mobile number"
              />
            </div>
            {error && <span className="error-text">Please enter a valid 10-digit mobile number</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block send-otp-btn">
            Send OTP
          </button>
        </form>

        {/* Divider OR */}
        <div className="or-separator">
          <div className="separator-line"></div>
          <span className="or-text">OR</span>
          <div className="separator-line"></div>
        </div>

        {/* Secondary options row */}
        <div className="alternative-actions">
          <button type="button" className="btn btn-outline" onClick={onEmailLogin}>
            <Mail size={18} className="btn-icon" />
            <span>Email</span>
          </button>
          
          <button type="button" className="btn btn-outline" onClick={onGuestLogin}>
            <User size={18} className="btn-icon" />
            <span>Guest</span>
          </button>
        </div>
      </div>

      {/* Navigation link to Sign Up */}
      <p className="login-footer" style={{ marginBottom: '8px', cursor: 'pointer' }}>
        Don't have an account?{' '}
        <strong className="footer-link" onClick={onNavigateSignUp} style={{ color: 'var(--color-brand)' }}>
          Sign up
        </strong>
      </p>

      {/* Footer disclaimer */}
      <p className="login-footer">
        By continuing, you agree to our <strong className="footer-link">Terms of Service</strong> and <strong className="footer-link">Privacy Policy</strong>.
      </p>
    </div>
  );
}
