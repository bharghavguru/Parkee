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
import ListYourSpace from './components/ListYourSpace';

export default function App() {
  const [screen, setScreen] = useState('signup'); // starts at 'signup' as requested first!
  const [phoneNumber, setPhoneNumber] = useState('');
  const [spots, setSpots] = useState([
    {
      id: 1,
      title: '12 Khader Nawaz Khan Road',
      distance: '0.2 km away',
      type: 'Driveway',
      price: '80.00',
      rating: '4.9',
      reviews: 156,
      verified: true,
      cctv: true,
      security: true,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'T. Nagar Multi-Level Parking',
      distance: '0.5 km away',
      type: 'Underground',
      price: '120.00',
      rating: '4.7',
      reviews: 89,
      verified: false,
      cctv: true,
      security: true,
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'Adyar Private Car Park',
      distance: '0.8 km away',
      type: 'Private Lot',
      price: '60.00',
      rating: '4.5',
      reviews: 210,
      verified: false,
      cctv: false,
      security: false,
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600'
    }
  ]);
  const [activeOtp, setActiveOtp] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  
  // Real-time user session status
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+91 98765 43210'
  });

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
    setCurrentUser(prev => ({
      ...prev,
      phone: phone
    }));
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
    setCurrentUser({
      name: 'Guest User',
      email: 'guest@parkee.com',
      phone: '+91 99999 99999'
    });
    setScreen('usertype-select');
    setToastMessage("Signed in under temporary Guest authorization");
  };

  // Handle email login submission
  const handleEmailSubmit = (emailVal) => {
    setCurrentUser({
      name: emailVal.split('@')[0], // Extract username from email as mock name
      email: emailVal,
      phone: '+91 98765 43210'
    });
    setScreen('usertype-select');
  };

  const handleLogout = () => {
    setScreen('signup');
    setPhoneNumber('');
    setActiveOtp('');
    setSelectedSpot(null);
    setActiveBooking(null);
    setDefaultHomeTab('home');
    setCurrentUser({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+91 98765 43210'
    });
  };

  // Render stateful screen content inside simulated phone shell
  const renderScreen = () => {
    switch (screen) {
      case 'signup':
        return (
          <SignUp 
            onSignUpSubmit={(name, email, phone) => {
              setCurrentUser({ name, email, phone });
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
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchToHost={() => setScreen('host')}
            onSelectSpot={(spot) => {
              setSelectedSpot(spot);
              setScreen('spot-details');
            }}
            activeBooking={activeBooking}
            initialTab={defaultHomeTab}
            spots={spots}
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
            onListNewSpace={() => setScreen('list-space')}
          />
        );
      case 'list-space':
        return (
          <ListYourSpace
            onBack={() => setScreen('host')}
            onSubmit={(newSpot) => {
              setSpots([newSpot, ...spots]);
              setToastMessage(`Success! New space "${newSpot.title}" has been listed.`);
              setScreen('host');
            }}
          />
        );
      default:
        return (
          <SignUp 
            onSignUpSubmit={(name, email, phone) => {
              setCurrentUser({ name, email, phone });
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
