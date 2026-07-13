import React from 'react';
import { ArrowLeft, PlusCircle, LayoutDashboard, IndianRupee, Calendar } from 'lucide-react';
import Logo from './Logo';

export default function RenterDashboard({ onBack, onListNewSpace }) {
  return (
    <div className="login-screen-animation host-portal-wrapper">
      {/* Navigation Header */}
      <div className="verify-nav-header">
        <button type="button" className="btn-back-link" onClick={onBack} aria-label="Go back to selection">
          <ArrowLeft size={22} className="back-arrow-icon" />
        </button>
        <span className="verify-nav-title">Host Portal</span>
        <div style={{ width: '22px' }}></div>
      </div>

      <div className="verify-container">
        <div className="verify-brand-logo">
          <Logo size="small" showText={false} />
        </div>

        <h1 className="verify-title">Hosting Dashboard</h1>
        <p className="verify-subtitle">Manage your garage, driveway, and earnings</p>

        {/* Analytics Card */}
        <div className="host-analytics-card">
          <div className="analytics-header">
            <span className="analytics-label">TOTAL EARNINGS</span>
            <IndianRupee size={20} className="analytics-icon" />
          </div>
          <p className="analytics-value">₹12,450.00</p>
          <div className="analytics-details">
            <div className="detail-stat">
              <span className="stat-label">Active Spots</span>
              <span className="stat-val">2</span>
            </div>
            <div className="detail-stat border-stat-left">
              <span className="stat-label">Bookings</span>
              <span className="stat-val">46</span>
            </div>
          </div>
        </div>

        {/* Host Actions Grid */}
        <div className="host-actions-list">
          <button type="button" className="btn btn-primary host-action-btn" onClick={onListNewSpace}>
            <PlusCircle size={18} className="btn-icon-left" />
            <span>List a New Space</span>
          </button>
          
          <button type="button" className="btn btn-outline host-action-btn-secondary">
            <LayoutDashboard size={18} className="btn-icon-left" />
            <span>Manage My Spaces</span>
          </button>

          <button type="button" className="btn btn-outline host-action-btn-secondary">
            <Calendar size={18} className="btn-icon-left" />
            <span>Active Reservations</span>
          </button>
        </div>

        <p className="host-footer-tip">
          Need help setting up your driveway? Contact PARKEE Host Support.
        </p>
      </div>
    </div>
  );
}
