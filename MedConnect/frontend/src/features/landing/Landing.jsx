import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { SPECIALTIES } from '../patient/data/pakistanMedicalData';
import CitySelectorModal from '../patient/components/CitySelectorModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Building2,
  Stethoscope,
  Activity,
  LogIn,
  UserPlus,
  HeartPulse,
  Award,
  Smartphone,
  Phone,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { currentUser, selectedCity, setIsCityModalOpen } = useDemo();

  return (
    <div style={{ backgroundColor: 'var(--canvas-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Top Navigation Bar */}
      <header
        style={{
          backgroundColor: 'var(--forest-800)',
          color: '#FFFFFF',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="logo-badge">+</div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px', display: 'block' }}>
              MedConnect
            </span>
            <span style={{ fontSize: '10px', color: 'var(--lime-accent)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Pakistan Healthcare
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Find Doctors
          </button>
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Specialties
          </button>
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Hospital Clinics
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup?role=doctor')}
            style={{ color: 'var(--lime-accent)', fontSize: '13.5px', fontWeight: '700' }}
          >
            Join as Clinician ↗
          </button>
        </nav>

        {/* Right CTA Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* City Selector Pill */}
          <button
            type="button"
            className="city-pill-btn"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            onClick={() => setIsCityModalOpen(true)}
          >
            <MapPin size={14} color="var(--lime-accent)" />
            <span>{selectedCity.name}</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
          </button>

          {/* Sign In & Sign Up buttons */}
          <button
            type="button"
            className="btn-white-capsule"
            style={{ padding: '8px 18px', fontSize: '13px' }}
            onClick={() => navigate('/login')}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            className="btn-lime-pill"
            style={{ padding: '8px 20px', fontSize: '13px' }}
            onClick={() => navigate('/signup')}
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 32px 64px 32px' }}>
        {/* Exact Canva Hero Card with Starburst graphic watermark */}
        <section className="canva-hero-card">
          <svg
            className="canva-starburst"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 0V200M0 100H200M29.29 29.29L170.71 170.71M29.29 170.71L170.71 29.29"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>

          <div className="hero-pill-badge">
            <Sparkles size={13} />
            <span>PAKISTAN'S PREMIER HEALTHCARE PLATFORM</span>
          </div>

          <h1 className="hero-title">
            A better way to find care and manage every visit.
          </h1>

          <p className="hero-sub">
            Book appointments with PMDC-verified doctors across 10 major Pakistani cities. Choose between instant video consultations or priority in-clinic visits at leading hospital networks.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => navigate('/doctors')}
            >
              <span>Book an appointment</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate('/signup?role=doctor')}
            >
              <span>Apply as a doctor</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate('/login')}
            >
              <span>Sign in to account</span>
            </button>
          </div>
        </section>

        {/* Quick Access Role Portals (Streamlined & Clean) */}
        <section className="canva-role-cards-grid" style={{ marginTop: '24px' }}>
          {/* Patient Card */}
          <div className="role-entry-card">
            <div className="role-card-badge">Patient Portal</div>
            <p className="role-card-desc">Find PMDC specialists, schedule visits, and access digital prescriptions.</p>
            <button
              type="button"
              className="btn-open-role"
              onClick={() => navigate('/login?role=patient')}
            >
              <span>Enter as Patient</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Doctor Card */}
          <div className="role-entry-card">
            <div className="role-card-badge">Clinician Workspace</div>
            <p className="role-card-desc">Review booking requests, conduct video visits, and issue official prescriptions.</p>
            <button
              type="button"
              className="btn-open-role"
              onClick={() => navigate('/login?role=doctor')}
            >
              <span>Enter as Doctor</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Admin Card */}
          <div className="role-entry-card">
            <div className="role-card-badge">Operations Console</div>
            <p className="role-card-desc">Verify doctor PMDC licenses, manage hospital clinics, and review activity.</p>
            <button
              type="button"
              className="btn-open-role"
              onClick={() => navigate('/login?role=admin')}
            >
              <span>Enter as Admin</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* Top Specialties Grid */}
        <section style={{ marginTop: '48px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Top Medical Specialties</h2>
              <p>Consult with certified specialists in your city or online</p>
            </div>
            <button
              type="button"
              className="link-see-all"
              onClick={() => navigate('/doctors')}
            >
              View all 20+ specialties <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
            {SPECIALTIES.slice(0, 8).map((sp) => (
              <div
                key={sp.id}
                onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(sp.name)}`)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--forest-700)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(197, 225, 165, 0.4)',
                      color: 'var(--forest-800)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Stethoscope size={20} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--forest-700)', fontFamily: 'serif' }}>
                    {sp.urdu}
                  </span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '14px 0 4px 0', color: 'var(--text-main)' }}>
                  {sp.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {sp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section style={{ marginTop: '48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
              <ShieldCheck size={28} color="var(--forest-800)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '12px 0 6px 0' }}>100% PMDC Verified</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                Every doctor’s license is validated with the Pakistan Medical & Dental Council.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
              <Video size={28} color="var(--forest-800)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '12px 0 6px 0' }}>Instant Telehealth</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                Encrypted video consultations with electronic prescription delivery.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
              <Building2 size={28} color="var(--forest-800)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '12px 0 6px 0' }}>Partner Hospitals</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                Consult at Shifa, National Hospital, South City, Doctors Hospital, and more.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
              <Smartphone size={28} color="var(--forest-800)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '12px 0 6px 0' }}>Local Payment Options</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                Pay seamlessly via JazzCash, EasyPaisa, Debit Card, or Cash at Hospital.
              </p>
            </div>
          </div>
        </section>

        {/* Doctor Recruitment Callout */}
        <section
          style={{
            marginTop: '48px',
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
              JOIN THE MEDCONNECT CLINICIAN NETWORK
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '6px 0 10px 0' }}>
              Are you a qualified medical practitioner?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-white-muted)', margin: 0, lineHeight: '1.6' }}>
              Expand your consultation practice, manage your hospital timetable, and see video patients across Pakistan. Submit your PMDC license number for verification by our operations team.
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            style={{ padding: '14px 28px', fontSize: '14px' }}
            onClick={() => navigate('/signup?role=doctor')}
          >
            <span>Register as a Doctor</span>
            <ArrowRight size={17} />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-subtle)',
          padding: '28px 40px',
          marginTop: 'auto',
          fontSize: '12.5px',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <b>MedConnect Pakistan</b> · © 2026 MedConnect Healthcare Platform. Designed following oladoc.com flow & Canva specifications.
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button type="button" onClick={() => navigate('/login?role=admin')} style={{ color: 'var(--forest-800)', fontWeight: '700' }}>
            Admin Console ↗
          </button>
          <span>Lahore · Karachi · Islamabad</span>
        </div>
      </footer>

      {/* City Selector Modal */}
      <CitySelectorModal />
    </div>
  );
}
export { Landing };
