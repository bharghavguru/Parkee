import React, { useState } from 'react';
import SignUp from './components/SignUp';
import PhoneLogin from './components/PhoneLogin';
import OTPVerification from './components/OTPVerification';
import EmailLogin from './components/EmailLogin';
import UserTypeSelection from './components/UserTypeSelection';
import HomeNearbySpots from './components/HomeNearbySpots';
import RenterDashboard from './components/RenterDashboard';
import SpotDetails from './components/SpotDetails';
import BookingForm from './components/BookingForm';
import Toast from './components/Toast';

export default function App() {
  const [screen, setScreen] = useState('signup'); // starts at 'signup' as requested first!
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeOtp, setActiveOtp] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  
  // Spots and reservation states
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [defaultHomeTab, setDefaultHomeTab] = useState('home');

  // Generate a random 6-digit OTP code programmatically
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle phone submission & transition to OTP page
  const handleSendOTP = (phone) => {
    const code = generateOTP();
    setPhoneNumber(phone);
    setActiveOtp(code);
    setToastMessage(`Your PARKEE verification code is ${code}. Valid for 10 min.`);
    setScreen('verify-otp');
  };

  // Verify entered OTP
  const handleVerifyOtp = (otpCode) => {
    if (otpCode === activeOtp) {
      setScreen('usertype-select');
      return true;
    }
    return false;
  };

  // Resend OTP trigger
  const handleResendOtp = () => {
    const code = generateOTP();
    setActiveOtp(code);
    setToastMessage(`New SMS received: Your PARKEE code is ${code}`);
  };

  // Handle guest quick-login
  const handleGuestLogin = () => {
    setScreen('usertype-select');
    setToastMessage("Signed in under temporary Guest authorization");
  };

  // Handle email login submission
  const handleEmailSubmit = () => {
    setScreen('usertype-select');
  };

  const handleLogout = () => {
    setScreen('signup');
    setPhoneNumber('');
    setActiveOtp('');
    setSelectedSpot(null);
    setActiveBooking(null);
    setDefaultHomeTab('home');
  };

  // Render stateful screen content inside simulated phone shell
  const renderScreen = () => {
    switch (screen) {
      case 'signup':
        return (
          <SignUp 
            onSignUpSubmit={(name, email, phone) => {
              setPhoneNumber(phone);
              setToastMessage(`Welcome to PARKEE, ${name}! Your account has been created.`);
              setScreen('usertype-select');
            }}
            onNavigateToLogin={() => setScreen('login')}
          />
        );
      case 'login':
        return (
          <PhoneLogin
            onSendOTP={handleSendOTP}
            onEmailLogin={() => setScreen('email-login')}
            onGuestLogin={handleGuestLogin}
            onNavigateSignUp={() => setScreen('signup')}
          />
        );
      case 'verify-otp':
        return (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerify={handleVerifyOtp}
            onBack={() => setScreen('login')}
            onTriggerResend={handleResendOtp}
          />
        );
      case 'email-login':
        return (
          <EmailLogin
            onLoginSubmit={handleEmailSubmit}
            onBackToPhone={() => setScreen('login')}
          />
        );
      case 'usertype-select':
        return (
          <UserTypeSelection
            onSelectType={(type) => setScreen(type === 'parker' ? 'home' : 'host')}
            onBack={() => setScreen('signup')}
          />
        );
      case 'home':
        return (
          <HomeNearbySpots
            onLogout={handleLogout}
            onSwitchToHost={() => setScreen('host')}
            onSelectSpot={(spot) => {
              setSelectedSpot(spot);
              setScreen('spot-details');
            }}
            activeBooking={activeBooking}
            initialTab={defaultHomeTab}
          />
        );
      case 'spot-details':
        return (
          <SpotDetails
            spot={selectedSpot}
            onBack={() => {
              setDefaultHomeTab('home');
              setScreen('home');
            }}
            onBookNow={(spot) => {
              setSelectedSpot(spot);
              setScreen('booking-form');
            }}
          />
        );
      case 'booking-form':
        return (
          <BookingForm
            spot={selectedSpot}
            onBack={() => setScreen('spot-details')}
            onConfirmBooking={(spot, totalPrice) => {
              setActiveBooking({ spot, price: totalPrice });
              setDefaultHomeTab('bookings');
              setToastMessage(`Booking confirmed at ${spot.title}!`);
              setScreen('home');
            }}
          />
        );
      case 'host':
        return (
          <RenterDashboard
            onBack={() => setScreen('usertype-select')}
          />
        );
      default:
        return (
          <SignUp 
            onSignUpSubmit={(name, email, phone) => {
              setPhoneNumber(phone);
              setToastMessage(`Welcome to PARKEE, ${name}! Your account has been created.`);
              setScreen('usertype-select');
            }}
            onNavigateToLogin={() => setScreen('login')}
          />
        );
    }
  };

  return (
    <main className="device-container">
      {/* Toast Notification for Simulated SMS delivery overlays */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Embedded Simulated Screen Contents */}
      <section className="device-screen-content">
        {renderScreen()}
      </section>
    </main>
  );
}
