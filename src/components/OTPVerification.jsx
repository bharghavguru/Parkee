import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';

export default function OTPVerification({ phoneNumber, onVerify, onBack, onTriggerResend }) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef(Array(6).fill(null));

  // Focus the first input field on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer countdown for resending
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (e, idx) => {
    setError(false);
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input box
    if (value !== '' && idx < 5 && inputRefs.current[idx + 1]) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[idx] === '' && idx > 0 && inputRefs.current[idx - 1]) {
        // If current is empty, delete previous and focus it
        newOtp[idx - 1] = '';
        setOtp(newOtp);
        inputRefs.current[idx - 1].focus();
      } else {
        // Otherwise just clear current
        newOtp[idx] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = pasteData[i];
      }
    }
    setOtp(newOtp);

    // Focus either the last input or the next empty one
    const focusIndex = Math.min(pasteData.length, 5);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError(true);
      return;
    }
    onVerify(otpCode);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(Array(6).fill(''));
    setResendTimer(30);
    onTriggerResend();
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="login-screen-animation">
      {/* Navigation Header */}
      <div className="verify-nav-header">
        <button type="button" className="btn-back-link" onClick={onBack} aria-label="Go back to login screen">
          <ArrowLeft size={22} className="back-arrow-icon" />
        </button>
        <span className="verify-nav-title">PARKEE</span>
        <div style={{ width: '22px' }}></div> {/* Spacer for symmetry */}
      </div>

      {/* Main Verification Container */}
      <div className="verify-container">
        <div className="verify-brand-logo">
          <Logo size="small" showText={true} />
        </div>

        <h1 className="verify-title">Verify your number</h1>
        <p className="verify-subtitle">
          We've sent a 6-digit code to <strong className="phone-highlighter">{phoneNumber}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          {/* 6 Digit codes grid */}
          <div className="otp-fields-grid">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                placeholder="-"
                className={`otp-digit-box ${error ? 'otp-box-error animate-shake' : ''}`}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {error && <p className="error-text text-center select-none">Please enter all 6 digits of the OTP code</p>}

          <button type="submit" className="btn btn-primary btn-block verify-action-btn">
            Verify
          </button>
        </form>

        {/* Resend actions link */}
        <div className="resend-opt-wrapper">
          {resendTimer > 0 ? (
            <span className="resend-timer-text select-none">
              Resend OTP in <strong className="timer-countdown">{resendTimer}s</strong>
            </span>
          ) : (
            <button type="button" className="btn-resend-action" onClick={handleResend}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
