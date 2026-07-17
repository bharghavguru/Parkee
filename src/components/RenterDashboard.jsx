import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  LayoutDashboard, 
  IndianRupee, 
  Calendar, 
  SlidersHorizontal, 
  Plus, 
  Search, 
  ClipboardList, 
  Wallet, 
  User, 
  Home, 
  MapPin,
  MessageSquare,
  Bell,
  TrendingUp,
  Users
} from 'lucide-react';
import Logo from './Logo';

export default function RenterDashboard({ onBack, onListNewSpace, onNavigateRenter, onSpotFreed, spots }) {
  const [view, setView] = useState('dashboard');
  const [selectedResForDetails, setSelectedResForDetails] = useState(null);

  const [activeReservations, setActiveReservations] = useState([
    {
      id: 1,
      name: 'John Smith',
      car: 'Tesla Model 3 • TN 10 AW 9988',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      location: '12 Khader Nawaz Khan Road, Nungambakkam',
      timeRemaining: 'Ends in 45m',
      status: 'active',
      progress: '75%',
      progressColor: '#006C35',
      vehicleDetails: 'Tesla Model 3 (Midnight Silver Metallic) • TN 10 AW 9988',
      timeRange: '11:00 AM - 12:30 PM',
      priceDetails: '₹120.00 (1.5 hrs @ ₹80/hr)',
      customerQuery: 'Hi host, is the EV charging point near the gate available and free to use during my reservation?'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      car: 'Audi A4 • TN 06 KF 4411',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      location: '12 Khader Nawaz Khan Road, Nungambakkam',
      timeRemaining: 'Overstaying: 12m',
      status: 'overstay',
      progress: '100%',
      progressColor: 'var(--color-error)',
      vehicleDetails: 'Audi A4 (Glacier White) • TN 06 KF 4411',
      timeRange: '10:30 AM - 11:30 AM',
      priceDetails: '₹80.00 (1.0 hr @ ₹80/hr) + ₹16.00 overstay fee',
      customerQuery: 'Sorry, I am stuck in a meeting and might overstay by 10-15 minutes. Can I pay the extra amount directly through the app or in person?'
    },
    {
      id: 3,
      name: 'Marcus Miller',
      car: 'BMW iX • TN 09 BZ 7722',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      location: 'T. Nagar Multi-Level Parking, Chennai',
      timeRemaining: 'Ends in 2h 15m',
      status: 'active',
      progress: '35%',
      progressColor: 'var(--color-brand)',
      vehicleDetails: 'BMW iX (Phytonic Blue Metallic) • TN 09 BZ 7722',
      timeRange: '11:30 AM - 2:00 PM',
      priceDetails: '₹300.00 (2.5 hrs @ ₹120/hr)',
      customerQuery: 'I have some luggage to drop off. Is there wheelchair or step-free access from the parking spot to the street entrance?'
    }
  ]);

  const handleMarkAsLeft = (res) => {
    setActiveReservations(prev => prev.filter(r => r.id !== res.id));
    if (onSpotFreed) {
      onSpotFreed(res);
    }
  };

  const defaultHostSpots = [
    {
      id: 'hs1',
      title: '12 Khader Nawaz Khan Road',
      location: 'Nungambakkam, Chennai',
      status: 'ACTIVE',
      price: '80.00',
      bookingsMtd: '28 sessions',
      totalEarned: '22,400.00',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'hs2',
      title: 'T. Nagar Multi-Level Parking',
      location: 'T. Nagar, Chennai',
      status: 'PENDING REVIEW',
      price: '120.00',
      bookingsMtd: '0 sessions',
      totalEarned: '0.00',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'hs3',
      title: 'Adyar Private Car Park',
      location: 'Adyar, Chennai',
      status: 'HIDDEN',
      price: '60.00',
      bookingsMtd: '12 sessions',
      totalEarned: '7,200.00',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const userAddedSpots = (spots || []).filter(s => s.id > 3).map(s => ({
    id: `user-${s.id}`,
    title: s.title,
    location: s.title.includes(',') ? s.title : `${s.title}, Chennai`,
    status: 'ACTIVE',
    price: s.price,
    bookingsMtd: '0 sessions',
    totalEarned: '0.00',
    image: s.image
  }));

  const allHostSpots = [...defaultHostSpots, ...userAddedSpots];
  const activeSpotsCount = allHostSpots.filter(s => s.status === 'ACTIVE').length;
  const staticEarnings = 29600.00;
  const totalEarningsInRupees = staticEarnings;

  const renderHeader = () => {
    if (view === 'reservations') {
      return (
        <header className="home-top-bar" style={{ flexShrink: 0, justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 22 }} />
          <span className="home-brand-title" style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-brand)', flex: 1, textAlign: 'center' }}>Active Reservations</span>
          <button 
            type="button" 
            className="btn-notification-bell" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand)', display: 'flex', alignItems: 'center' }}
          >
            <Bell size={22} />
          </button>
        </header>
      );
    }
    
    return (
      <header className="home-top-bar" style={{ flexShrink: 0 }}>
        <div className="home-logo-wrap" style={{ display: 'flex', alignItems: 'center' }}>
          {view !== 'dashboard' ? (
            <button 
              type="button" 
              className="btn-back-link" 
              onClick={() => setView('dashboard')} 
              aria-label="Go back to host dashboard"
              style={{ background: 'none', border: 'none', padding: '0 8px 0 0', cursor: 'pointer', color: 'var(--color-brand)', display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeft size={22} className="back-arrow-icon" />
            </button>
          ) : (
            <button 
              type="button" 
              className="btn-back-link" 
              onClick={onBack} 
              aria-label="Go back to role selection"
              style={{ background: 'none', border: 'none', padding: '0 8px 0 0', cursor: 'pointer', color: 'var(--color-brand)', display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeft size={22} className="back-arrow-icon" />
            </button>
          )}

          <span className="home-brand-title">PARKEE</span>
        </div>
        
        <button type="button" className="profile-avatar-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onNavigateRenter && onNavigateRenter('profile')}>
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
            alt="User profile menu" 
            className="user-profile-avatar"
          />
        </button>
      </header>
    );
  };

  const renderDashboardView = () => (
    <div className="verify-container">
      <div className="verify-brand-logo">
        <Logo size="small" showText={false} />
      </div>
      <h1 className="verify-title">Hosting Dashboard</h1>
      <p className="verify-subtitle">Manage your garage, driveway, and earnings</p>

      <div className="host-analytics-card">
        <div className="analytics-header">
          <span className="analytics-label">TOTAL EARNINGS</span>
          <IndianRupee size={20} className="analytics-icon" />
        </div>
        <p className="analytics-value">₹{totalEarningsInRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <div className="analytics-details">
          <div className="detail-stat">
            <span className="stat-label">Active Spots</span>
            <span className="stat-val">{activeSpotsCount}</span>
          </div>
          <div className="detail-stat border-stat-left">
            <span className="stat-label">Bookings (MTD)</span>
            <span className="stat-val">40</span>
          </div>
        </div>
      </div>

      <div className="host-actions-list">
        <button type="button" className="btn btn-primary host-action-btn" onClick={onListNewSpace}>
          <PlusCircle size={18} className="btn-icon-left" />
          <span>List a New Space</span>
        </button>
        
        <button type="button" className="btn btn-outline host-action-btn-secondary" onClick={() => setView('manage')}>
          <LayoutDashboard size={18} className="btn-icon-left" />
          <span>Manage My Spaces</span>
        </button>

        <button type="button" className="btn btn-outline host-action-btn-secondary" onClick={() => setView('reservations')}>
          <Calendar size={18} className="btn-icon-left" />
          <span>Active Reservations</span>
        </button>
      </div>

      <p className="host-footer-tip">
        Need help setting up your driveway? Contact PARKEE Host Support.
      </p>
    </div>
  );

  const renderManageView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="host-portal-header-section" style={{ padding: '20px 16px 12px 16px', textAlign: 'left' }}>
        <span className="host-portal-tag" style={{ color: 'var(--color-green)', fontSize: '11px', fontWeight: '750', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Host Portal</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <h1 className="host-portal-title" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-brand)', margin: 0 }}>My Parking Spots</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn-filter-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', border: '1px solid var(--color-border)', borderRadius: '12px', background: '#ffffff', cursor: 'pointer' }}>
              <SlidersHorizontal size={16} style={{ color: 'var(--color-brand)' }} />
            </button>
            <button 
              type="button" 
              className="btn-add-new-header" 
              onClick={onListNewSpace}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-brand)', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '0 14px', fontSize: '12px', fontWeight: '750', height: '38px', cursor: 'pointer' }}
            >
              <Plus size={14} strokeWidth={3} />
              <span>ADD NEW</span>
            </button>
          </div>
        </div>
      </div>

      <div className="host-summary-row" style={{ display: 'flex', gap: '12px', padding: '0 16px 16px 16px', flexShrink: 0 }}>
        <div className="summary-status-card" style={{ flex: 1, backgroundColor: 'var(--color-brand)', color: '#ffffff', padding: '16px', borderRadius: '16px', textAlign: 'left', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: '700' }}>Total Active Spots</span>
          <span style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1.1 }}>{activeSpotsCount}</span>
        </div>
        <div className="summary-status-card" style={{ flex: 1, backgroundColor: '#86efac', color: 'var(--color-brand)', padding: '16px', borderRadius: '16px', textAlign: 'left', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '11px', opacity: 0.8, fontWeight: '700' }}>Monthly Earnings</span>
          <span style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1.1 }}>₹1,03,500.00</span>
        </div>
      </div>

      <div className="host-spots-list" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1, paddingBottom: '30px' }}>
        {allHostSpots.map(spot => (
          <div key={spot.id} className="host-spot-card" style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <img src={spot.image} alt={spot.title} style={{ width: '80px', height: '80px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-brand)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{spot.title}</h3>
                  <span className={`status-badge-${spot.status.toLowerCase().replace(' ', '-')}`} style={{ 
                    fontSize: '9px', 
                    fontWeight: '800', 
                    padding: '3px 8px', 
                    borderRadius: '20px', 
                    letterSpacing: '0.3px',
                    flexShrink: 0,
                    backgroundColor: spot.status === 'ACTIVE' ? 'rgba(0, 108, 53, 0.1)' : spot.status === 'PENDING REVIEW' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    color: spot.status === 'ACTIVE' ? '#006C35' : spot.status === 'PENDING REVIEW' ? '#B45309' : '#475569'
                  }}>
                    {spot.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: '550' }}>
                  <MapPin size={13} style={{ color: 'var(--color-green)' }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{spot.location}</span>
                </div>

                <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: '800', color: 'var(--color-brand)' }}>
                  ₹{spot.price} <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '500' }}>/ hour</span>
                </p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '14px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Bookings (MTD)</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '800', color: 'var(--color-brand)' }}>{spot.bookingsMtd}</p>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total Earned</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '800', color: '#006C35' }}>₹{spot.totalEarned}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1, height: '38px', fontSize: '12.5px', fontWeight: '750', borderRadius: '12px', borderColor: 'var(--color-border)', color: 'var(--color-brand)', padding: 0 }}>
                EDIT
              </button>
              {spot.status === 'ACTIVE' && (
                <button type="button" className="btn" style={{ flex: 1, height: '38px', fontSize: '12.5px', fontWeight: '750', borderRadius: '12px', background: 'var(--color-brand)', color: '#ffffff', padding: 0 }}>
                  VIEW DETAILS
                </button>
              )}
              {spot.status === 'PENDING REVIEW' && (
                <button type="button" className="btn" style={{ flex: 1, height: '38px', fontSize: '12.5px', fontWeight: '750', borderRadius: '12px', background: '#cbd5e1', color: '#475569', cursor: 'not-allowed', padding: 0 }} disabled>
                  WITHDRAW
                </button>
              )}
              {spot.status === 'HIDDEN' && (
                <button type="button" className="btn" style={{ flex: 1, height: '38px', fontSize: '12.5px', fontWeight: '750', borderRadius: '12px', background: '#006C35', color: '#ffffff', padding: 0 }}>
                  RE-ACTIVATE
                </button>
              )}
            </div>
          </div>
        ))}

        <button 
          type="button" 
          onClick={onListNewSpace}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            padding: '20px', 
            borderRadius: '20px', 
            border: '2px dashed var(--color-border)', 
            background: 'rgba(241, 245, 249, 0.4)', 
            cursor: 'pointer',
            width: '100%',
            outline: 'none',
            transition: 'all 0.2s',
            color: 'var(--color-brand)',
            fontFamily: 'inherit'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
            Got another space? <span style={{ color: 'var(--color-brand)', fontWeight: '750' }}>List it now</span> to start earning.
          </div>
        </button>
      </div>

    </div>
  );

  const renderReservationsView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      <div style={{ padding: '20px 16px 12px 16px', textAlign: 'left', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-brand)', margin: 0 }}>Active Now</h1>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '800', 
            backgroundColor: 'rgba(0, 108, 53, 0.1)', 
            color: '#006C35', 
            padding: '6px 12px', 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#006C35', borderRadius: '50%', display: 'inline-block' }}></span>
            {activeReservations.length} Active Spots
          </span>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1, paddingBottom: '30px' }}>
        
        {activeReservations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
            No active reservations right now.
          </div>
        )}

        {activeReservations.map(res => (
          <div key={res.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img 
                  src={res.image} 
                  alt={res.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-brand)', margin: 0 }}>{res.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600' }}>{res.car}</span>
                </div>
              </div>
              <button type="button" style={{ width: '38px', height: '38px', border: '1px solid var(--color-border)', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-brand)' }}>
                <MessageSquare size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '14px 0', color: 'var(--color-text-muted)', fontSize: '13px', fontWeight: '550', textAlign: 'left' }}>
              <MapPin size={15} style={{ color: 'var(--color-green)' }} />
              <span>{res.location}</span>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Time Remaining</span>
                <span style={{ color: res.progressColor }}>{res.timeRemaining}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: res.progress, height: '100%', backgroundColor: res.progressColor, borderRadius: '4px' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setSelectedResForDetails(res)} 
                className="btn btn-outline" 
                style={{ flex: 1, height: '38px', fontSize: '12.5px', fontWeight: '750', borderRadius: '12px', borderColor: 'var(--color-border)', color: 'var(--color-brand)' }}
              >
                Details
              </button>
              <button type="button" onClick={() => handleMarkAsLeft(res)} className="btn" style={{ flex: 1, height: '38px', fontSize: '12.5px', fontWeight: '750', borderRadius: '12px', background: '#006C35', color: '#ffffff' }}>
                Mark as Left
              </button>
            </div>
          </div>
        ))}


      </div>

    </div>
  );

  const renderEarningsView = () => (
    <div className="verify-container" style={{ textAlign: 'left' }}>
      <h1 className="verify-title" style={{ margin: '0 0 16px 0' }}>Earnings</h1>
      
      <div className="host-analytics-card" style={{ marginBottom: '24px' }}>
        <div className="analytics-header">
          <span className="analytics-label">TOTAL PAID OUT</span>
          <IndianRupee size={20} className="analytics-icon" />
        </div>
        <p className="analytics-value">₹29,600.00</p>
        <div className="analytics-details">
          <div className="detail-stat">
            <span className="stat-label">Last Payout</span>
            <span className="stat-val">₹22,400.00</span>
          </div>
          <div className="detail-stat border-stat-left">
            <span className="stat-label">Next Payout</span>
            <span className="stat-val">₹7,200.00</span>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-brand)', marginBottom: '12px' }}>Payout Transactions</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--color-brand)' }}>Payout to HDFC Bank</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>Jul 12, 2026</p>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#006C35' }}>+₹22,400.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--color-brand)' }}>Payout to Visa (4242)</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>Jun 28, 2026</p>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#006C35' }}>+₹7,200.00</span>
        </div>
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch (view) {
      case 'dashboard':
        return renderDashboardView();
      case 'manage':
        return renderManageView();
      case 'reservations':
        return renderReservationsView();
      case 'earnings':
        return renderEarningsView();
      default:
        return renderDashboardView();
    }
  };

  return (
    <div className="login-screen-animation host-portal-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      {renderHeader()}

      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {renderActiveView()}
      </div>

      <footer className="home-bottom-navbar" style={{ flexShrink: 0, height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border)', padding: '0 8px' }}>
        <button 
          type="button" 
          onClick={() => setView('dashboard')}
          style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: view === 'dashboard' ? '#0b1f3c' : 'var(--color-text-muted)',
            fontWeight: '750',
            fontSize: '12px',
            backgroundColor: view === 'dashboard' ? '#86efac' : 'transparent',
            padding: view === 'dashboard' ? '8px 16px' : '8px',
            borderRadius: '30px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s'
          }}
        >
          <LayoutDashboard size={20} />
          {view === 'dashboard' && <span>Dashboard</span>}
        </button>

        <button 
          type="button" 
          onClick={() => setView('manage')}
          style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: view === 'manage' ? '#0b1f3c' : 'var(--color-text-muted)',
            fontWeight: '750',
            fontSize: '12px',
            backgroundColor: view === 'manage' ? '#86efac' : 'transparent',
            padding: view === 'manage' ? '8px 16px' : '8px',
            borderRadius: '30px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s'
          }}
        >
          <MapPin size={20} />
          {view === 'manage' && <span>Spots</span>}
        </button>

        <button 
          type="button" 
          onClick={() => setView('reservations')}
          style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: view === 'reservations' ? '#0b1f3c' : 'var(--color-text-muted)',
            fontWeight: '750',
            fontSize: '12px',
            backgroundColor: view === 'reservations' ? '#86efac' : 'transparent',
            padding: view === 'reservations' ? '8px 16px' : '8px',
            borderRadius: '30px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s'
          }}
        >
          <Calendar size={20} />
          {view === 'reservations' && <span>Reservations</span>}
        </button>

        <button 
          type="button" 
          onClick={() => setView('earnings')}
          style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: view === 'earnings' ? '#0b1f3c' : 'var(--color-text-muted)',
            fontWeight: '750',
            fontSize: '12px',
            backgroundColor: view === 'earnings' ? '#86efac' : 'transparent',
            padding: view === 'earnings' ? '8px 16px' : '8px',
            borderRadius: '30px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s'
          }}
        >
          <Wallet size={20} />
          {view === 'earnings' && <span>Earnings</span>}
        </button>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {selectedResForDetails && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 20000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div 
            onClick={() => setSelectedResForDetails(null)} 
            style={{ flex: 1, cursor: 'pointer' }}
          />
          <div style={{
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '32px',
            borderTopRightRadius: '32px',
            padding: '24px 20px 30px 20px',
            boxShadow: '0 -10px 25px rgba(0,0,0,0.1)',
            maxHeight: '85%',
            overflowY: 'auto',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: 'var(--color-border)',
              borderRadius: '2px',
              margin: '0 auto 20px auto'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-brand)', margin: 0 }}>Reservation Details</h2>
              <button 
                type="button" 
                onClick={() => setSelectedResForDetails(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--color-text-muted)'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', backgroundColor: 'var(--color-bg-light)', padding: '14px', borderRadius: '16px', marginBottom: '20px' }}>
              <img 
                src={selectedResForDetails.image} 
                alt={selectedResForDetails.name} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: 'var(--shadow-sm)' }} 
              />
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-brand)', margin: 0 }}>{selectedResForDetails.name}</h3>
                <span style={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  letterSpacing: '0.3px',
                  marginTop: '4px',
                  backgroundColor: selectedResForDetails.status === 'active' ? 'rgba(0, 108, 53, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                  color: selectedResForDetails.status === 'active' ? '#006C35' : '#e53e3e'
                }}>
                  {selectedResForDetails.status === 'active' ? 'ACTIVE' : 'OVERSTAYING'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  🚗 Vehicle Details
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '14.5px', fontWeight: '700', color: 'var(--color-brand)' }}>
                  {selectedResForDetails.vehicleDetails}
                </p>
              </div>

              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  🕒 Reserved Time
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '14.5px', fontWeight: '700', color: 'var(--color-brand)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedResForDetails.timeRange}</span>
                  <span style={{ fontSize: '12px', color: selectedResForDetails.progressColor, fontWeight: '700' }}>
                    {selectedResForDetails.timeRemaining}
                  </span>
                </p>
              </div>

              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  💳 Price & Earnings Details
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '14.5px', fontWeight: '700', color: '#006C35' }}>
                  {selectedResForDetails.priceDetails}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  💬 Customer Queries
                </span>
                <p style={{ 
                  margin: '6px 0 0 0', 
                  fontSize: '13.5px', 
                  fontWeight: '600', 
                  color: 'var(--color-brand)', 
                  backgroundColor: 'rgba(11, 46, 92, 0.04)', 
                  padding: '12px', 
                  borderRadius: '12px',
                  lineHeight: '1.4',
                  fontStyle: 'italic'
                }}>
                  "{selectedResForDetails.customerQuery}"
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={() => setSelectedResForDetails(null)}
                className="btn btn-outline" 
                style={{ flex: 1, height: '44px', fontSize: '14px', fontWeight: '750', borderRadius: '12px' }}
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={() => {
                  handleMarkAsLeft(selectedResForDetails);
                  setSelectedResForDetails(null);
                }} 
                className="btn" 
                style={{ flex: 1, height: '44px', fontSize: '14px', fontWeight: '750', borderRadius: '12px', background: '#006C35', color: '#ffffff' }}
              >
                Mark as Left
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
