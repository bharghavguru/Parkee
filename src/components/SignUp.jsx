import React, { useState } from 'react';
import { User, Mail, ChevronDown, ArrowRight } from 'lucide-react';

export default function SignUp({ onSignUpSubmit, onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [flag, setFlag] = useState('🇮🇳');
  const [error, setError] = useState(false);

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setCountryCode(val);
    if (val === '+91') setFlag('🇮🇳');
    else if (val === '+1') setFlag('🇺🇸');
    else if (val === '+44') setFlag('🇬🇧');
  };

  const handleChangePhone = (e) => {
    setError(false);
    const rawVal = e.target.value.replace(/\D/g, '');
    let formatted = rawVal;
    if (rawVal.length > 5 && countryCode === '+91') {
      formatted = `${rawVal.slice(0, 5)} ${rawVal.slice(5, 10)}`;
    }
    setPhoneNumber(formatted.slice(0, 11));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !email.includes('@') || !phoneNumber) {
      setError(true);
      return;
    }
    // Fire signup submit (routes to selection role page or shows a toast)
    onSignUpSubmit(fullName, email, `${countryCode} ${phoneNumber}`);
  };

  return (
    <div className="login-screen-animation signup-wrapper">
      {/* Brand title header */}
      <div className="signup-brand-logo">PARKEE</div>

      {/* Greeting labels */}
      <h1 className="signup-greeting-title">Join the Community</h1>
      <p className="signup-greeting-sub">Start parking smarter today</p>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="signup-form-body">
        {/* Full Name field */}
        <div className="form-group-signup">
          <label className="signup-label">FULL NAME</label>
          <div className="signup-input-container">
            <User size={18} className="signup-input-icon" />
            <input 
              type="text" 
              placeholder="John Doe" 
              value={fullName}
              onChange={(e) => { setError(false); setFullName(e.target.value); }}
              className="signup-field"
              required
              aria-label="Full Name input"
            />
          </div>
        </div>

        {/* Email Address field */}
        <div className="form-group-signup">
          <label className="signup-label">EMAIL ADDRESS</label>
          <div className="signup-input-container">
            <Mail size={18} className="signup-input-icon" />
            <input 
              type="email" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => { setError(false); setEmail(e.target.value); }}
              className="signup-field"
              required
              aria-label="Email Address input"
            />
          </div>
        </div>

        {/* Phone number picker */}
        <div className="form-group-signup">
          <label className="signup-label">PHONE NUMBER</label>
          <div className="signup-phone-layout-group">
            {/* Country Selector select wrapper override */}
            <div className="signup-phone-prefix-select">
              <span className="flag-emoji">{flag}</span>
              <span className="country-code" style={{ marginLeft: '4px', fontStyle: 'normal' }}>{countryCode}</span>
              <ChevronDown size={14} className="dropdown-arrow-icon" style={{ marginLeft: '4px', color: '#718096' }} />
              <select 
                value={countryCode} 
                onChange={handleCountryChange}
                aria-label="Country calling code select"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
            </div>

            <div className="signup-phone-input-wrap signup-input-container">
              <input 
                type="tel" 
                placeholder={countryCode === '+91' ? '98765 43210' : '555-0123'}
                value={phoneNumber}
                onChange={handleChangePhone}
                className="signup-field"
                required
                aria-label="Phone number input"
              />
            </div>
          </div>
        </div>

        {error && (
          <span className="error-text" style={{ textAlign: 'left', display: 'block', marginBottom: '8px' }}>
            Please fill in all layout fields correctly.
          </span>
        )}

        {/* Create Account green button */}
        <button type="submit" className="btn-signup-primary">
          <span>Create Account</span>
          <ArrowRight size={18} />
        </button>
      </form>

      {/* Divider OR SIGN UP WITH */}
      <div className="signup-divider-row">
        <div className="signup-divider-line"></div>
        <span className="signup-divider-text">OR SIGN UP WITH</span>
        <div className="signup-divider-line"></div>
      </div>

      {/* Social Button grid links */}
      <div className="signup-social-grid">
        <button 
          type="button" 
          className="btn-social-signup" 
          onClick={() => onSignUpSubmit('Google Guest', 'google@parkee.com', '+91 9999988888')}
        >
          {/* Custom colorful Google 'G' icon drawing badge */}
          <span style={{ 
            width: '16px', 
            height: '16px', 
            borderRadius: '50%', 
            border: '2px solid #ea4335',
            backgroundColor: '#ea4335',
            display: 'inline-block',
            flexShrink: 0
          }}></span>
          <span>Google</span>
        </button>

        <button 
          type="button" 
          className="btn-social-signup"
          onClick={() => onSignUpSubmit('Apple Guest', 'apple@parkee.com', '+91 8888877777')}
        >
          {/* Custom black Apple icon drawing badge */}
          <span style={{ 
            width: '16px', 
            height: '16px', 
            borderRadius: '50%',
            backgroundColor: '#000000',
            display: 'inline-block',
            flexShrink: 0
          }}></span>
          <span>Apple</span>
        </button>
      </div>

      {/* Disclaimers terms */}
      <p className="signup-disclaimer-text">
        By creating an account, you agree to our{' '}
        <strong className="signup-link-bold">Terms of Service</strong> and{' '}
        <strong className="signup-link-bold">Privacy Policy</strong>.
      </p>

      {/* Navigate to Login Footer */}
      <p className="signup-footer-link" style={{ marginTop: '24px' }}>
        Already have an account?{' '}
        <strong className="signup-link-bold" onClick={onNavigateToLogin}>
          Log in
        </strong>
      </p>
    </div>
  );
}
