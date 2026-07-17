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
  // Safe storage helpers
  const getStorageItem = (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const setStorageItem = (key, val) => {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  };

  const removeStorageItem = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  };

  const [screen, setScreenState] = useState(() => getStorageItem('parkee_screen', 'signup'));
  const [isLoggedIn, setIsLoggedIn] = useState(() => getStorageItem('parkee_logged_in', 'false') === 'true');
  const setScreen = (newVal) => {
    setStorageItem('parkee_screen', newVal);
    setScreenState(newVal);
  };

  const setLoggedIn = (val) => {
    setStorageItem('parkee_logged_in', val ? 'true' : 'false');
    setIsLoggedIn(val);
  };

  const [phoneNumber, setPhoneNumberState] = useState(() => getStorageItem('parkee_phone', ''));
  const setPhoneNumber = (newVal) => {
    setStorageItem('parkee_phone', newVal);
    setPhoneNumberState(newVal);
  };

  const [spots, setSpotsState] = useState(() => {
    const saved = getStorageItem('parkee_spots', null);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
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
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
        status: 'ACTIVE',
        bookingsMtd: '28 sessions',
        totalEarned: '22,400.00'
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
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600',
        status: 'PENDING REVIEW',
        bookingsMtd: '0 sessions',
        totalEarned: '0.00'
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
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600',
        status: 'HIDDEN',
        bookingsMtd: '12 sessions',
        totalEarned: '7,200.00'
      }
    ];
  });
  const setSpots = (newVal) => {
    if (typeof newVal === 'function') {
      setSpotsState((prev) => {
        const next = newVal(prev);
        setStorageItem('parkee_spots', JSON.stringify(next));
        return next;
      });
    } else {
      setStorageItem('parkee_spots', JSON.stringify(newVal));
      setSpotsState(newVal);
    }
  };

  const [activeOtp, setActiveOtpState] = useState(() => getStorageItem('parkee_otp', ''));
  const setActiveOtp = (newVal) => {
    setStorageItem('parkee_otp', newVal);
    setActiveOtpState(newVal);
  };

  const [toastMessage, setToastMessage] = useState(null);
  
  // Real-time user session status
  const [currentUser, setCurrentUserState] = useState(() => {
    const saved = getStorageItem('parkee_current_user', null);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+91 98765 43210'
    };
  });
  const setCurrentUser = (newVal) => {
    if (typeof newVal === 'function') {
      setCurrentUserState((prev) => {
        const next = newVal(prev);
        setStorageItem('parkee_current_user', JSON.stringify(next));
        return next;
      });
    } else {
      setStorageItem('parkee_current_user', JSON.stringify(newVal));
      setCurrentUserState(newVal);
    }
  };

  // Spots and reservation states
  const [selectedSpot, setSelectedSpotState] = useState(() => {
    const saved = getStorageItem('parkee_selected_spot', null);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const setSelectedSpot = (newVal) => {
    if (newVal) {
      setStorageItem('parkee_selected_spot', JSON.stringify(newVal));
    } else {
      removeStorageItem('parkee_selected_spot');
    }
    setSelectedSpotState(newVal);
  };

  const [activeBooking, setActiveBookingState] = useState(() => {
    const saved = getStorageItem('parkee_active_booking', null);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const setActiveBooking = (newVal) => {
    if (newVal) {
      setStorageItem('parkee_active_booking', JSON.stringify(newVal));
    } else {
      removeStorageItem('parkee_active_booking');
    }
    setActiveBookingState(newVal);
  };

  const [defaultHomeTab, setDefaultHomeTabState] = useState('home');
  const setDefaultHomeTab = (newVal) => {
    setStorageItem('parkee_home_tab', newVal);
    setDefaultHomeTabState(newVal);
  };

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
      setLoggedIn(true);
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
    setLoggedIn(true);
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
    setLoggedIn(true);
    setScreen('usertype-select');
  };

  const handleLogout = () => {
    removeStorageItem('parkee_screen');
    removeStorageItem('parkee_phone');
    removeStorageItem('parkee_otp');
    removeStorageItem('parkee_selected_spot');
    removeStorageItem('parkee_active_booking');
    removeStorageItem('parkee_home_tab');
    removeStorageItem('parkee_current_user');
    removeStorageItem('parkee_spots');
    removeStorageItem('parkee_logged_in');

    setScreenState('signup');
    setIsLoggedIn(false);
    setPhoneNumberState('');
    setActiveOtpState('');
    setSelectedSpotState(null);
    setActiveBookingState(null);
    setDefaultHomeTabState('home');
    setCurrentUserState({
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
              setLoggedIn(true);
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
            isLoggedIn={isLoggedIn}
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
            onNavigateRenter={(tab) => {
              setDefaultHomeTab(tab);
              setScreen('home');
            }}
            onSpotFreed={(res) => {
              const newSpot = {
                id: Date.now(),
                title: res.location.split(',')[0],
                distance: '0.1 km away',
                type: 'Driveway',
                price: '50.00',
                rating: '5.0',
                reviews: 1,
                verified: true,
                cctv: true,
                security: true,
                instant: true,
                image: res.image || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=400',
                status: 'ACTIVE',
                bookingsMtd: '0 sessions',
                totalEarned: '0.00'
              };
              setSpots(prev => [newSpot, ...prev]);
              setToastMessage(`${res.location.split(',')[0]} is now unreserved and available!`);
            }}
            spots={spots}
            onUpdateSpot={(updatedSpot) => {
              setSpots(prev => prev.map(s => s.id === updatedSpot.id ? updatedSpot : s));
            }}
          />
        );
      case 'list-space':
        return (
          <ListYourSpace
            onBack={() => setScreen('host')}
            onSubmit={(newSpot) => {
              const fullSpot = {
                ...newSpot,
                status: 'ACTIVE',
                bookingsMtd: '0 sessions',
                totalEarned: '0.00'
              };
              setSpots([fullSpot, ...spots]);
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
              setLoggedIn(true);
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
