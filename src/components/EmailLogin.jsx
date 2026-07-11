import React, { useState } from 'react';
import { Phone, ChevronLeft } from 'lucide-react';
import Logo from './Logo';

export default function EmailLogin({ onLoginSubmit, onBackToPhone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !email.includes('@')) {
      setError(true);
      return;
    }
    onLoginSubmit(email);
  };

  return (
    <div className="login-screen-animation">
      {/* Navigation Header */}
      <div className="verify-nav-header">
        <button type="button" className="btn-back-link" onClick={onBackToPhone} aria-label="Go back to phone login">
          <ChevronLeft size={22} className="back-arrow-icon" />
        </button>
        <span className="verify-nav-title">PARKEE</span>
        <div style={{ width: '22px' }}></div>
      </div>

      <div className="verify-container">
        {/* Brand header */}
        <div className="brand-header">
          <Logo size="small" showText={true} />
          <h1>Sign in with Email</h1>
          <p className="subtitle">Enter your email and password to continue</p>
        </div>

        {/* Main interactive Card */}
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="form-group">
              <label className="input-label">EMAIL ADDRESS</label>
              <div className={`phone-input-wrapper flex-column ${error && !email ? 'input-error animate-shake' : ''}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setError(false); setEmail(e.target.value); }}
                  placeholder="name@email.com"
                  className="phone-number-field email-field"
                  aria-label="Enter email address"
                  style={{ width: '100%', paddingLeft: '16px' }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="form-group margin-top-sm">
              <label className="input-label">PASSWORD</label>
              <div className={`phone-input-wrapper flex-column ${error && !password ? 'input-error animate-shake' : ''}`}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setError(false); setPassword(e.target.value); }}
                  placeholder="••••••••"
                  className="phone-number-field email-field"
                  aria-label="Enter password"
                  style={{ width: '100%', paddingLeft: '16px' }}
                />
              </div>
            </div>

            {error && <span className="error-text">Please enter a valid email and password</span>}

            <button type="submit" className="btn btn-primary btn-block send-otp-btn margin-top-md">
              Sign In
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
            <button type="button" className="btn btn-outline btn-block btn-phone-alt" onClick={onBackToPhone}>
              <Phone size={18} className="btn-icon" />
              <span>Use Phone Number</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
