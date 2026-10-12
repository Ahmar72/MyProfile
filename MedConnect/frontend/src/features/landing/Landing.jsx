import React, { useState, useMemo } from 'react';
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
  Search,
  Star,
  Check,
  Lock,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Baby,
  Brain,
  Smile,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  BadgeAlert,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const {
    currentUser,
    logout,
    selectedCity,
    setIsCityModalOpen,
    doctorsList,
    branchesList,
    showToast,
  } = useDemo();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [consultationTypeFilter, setConsultationTypeFilter] = useState('all'); // 'all' | 'clinic' | 'video'
  const [howItWorksTab, setHowItWorksTab] = useState('patient'); // 'patient' | 'doctor'
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // In-page Inspection Modals (Keep user on landing page for complete info!)
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [selectedHospitalModal, setSelectedHospitalModal] = useState(null);
  const [authRequiredModal, setAuthRequiredModal] = useState({ open: false, doctor: null });

  // Verified Doctors (Active PMDC approved)
  const activeDoctors = useMemo(() => {
    return doctorsList.filter((d) => d.status === 'verified');
  }, [doctorsList]);

  // Filtered Doctors Showcase on Landing Page
  const filteredDoctors = useMemo(() => {
    return activeDoctors.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialtyFilter === 'All' || doc.specialty.toLowerCase() === selectedSpecialtyFilter.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        consultationTypeFilter === 'all' ||
        (consultationTypeFilter === 'video' && doc.videoFee) ||
        (consultationTypeFilter === 'clinic' && doc.inClinicFee);

      return matchesSpecialty && matchesSearch && matchesType;
    });
  }, [activeDoctors, selectedSpecialtyFilter, searchQuery, consultationTypeFilter]);

  // Search Autocomplete Suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();

    const matchedSpecialties = SPECIALTIES.filter((s) => s.name.toLowerCase().includes(query)).slice(0, 3);
    const matchedDoctors = activeDoctors.filter((d) => d.name.toLowerCase().includes(query)).slice(0, 3);
    const matchedHospitals = branchesList.filter((b) => b.name.toLowerCase().includes(query)).slice(0, 2);

    return [
      ...matchedSpecialties.map((s) => ({ type: 'Specialty', label: s.name, sub: s.urdu, targetId: 'specialties', filter: s.name })),
      ...matchedDoctors.map((d) => ({ type: 'Doctor', label: d.name, sub: `${d.specialty} · ${d.city}`, targetId: 'doctors', filter: d.specialty })),
      ...matchedHospitals.map((h) => ({ type: 'Hospital', label: h.name, sub: h.city, targetId: 'hospitals', filter: null })),
    ];
  }, [searchQuery, activeDoctors, branchesList]);

  // Smooth Scroll Helper
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Booking Click with Auth Check
  const handleBookingClick = (doctor) => {
    if (!currentUser) {
      // Unauthenticated visitor -> open friendly auth prompt modal right on landing page!
      setAuthRequiredModal({ open: true, doctor });
    } else if (currentUser.role === 'patient') {
      // Authenticated patient -> proceed to booking flow
      navigate(`/book?doctorId=${doctor.id}&type=${doctor.videoFee ? 'video' : 'clinic'}`);
    } else {
      showToast('Clinicians and administrators cannot book patient visits. Please sign in with a patient account.', 'warning');
    }
  };

  // FAQs Data
  const FAQS = [
    {
      q: 'How does MedConnect verify doctor qualifications & PMDC licenses?',
      a: 'Every medical practitioner on MedConnect must submit their valid Pakistan Medical & Dental Council (PMDC) registration certificate, specialist postgraduate degrees (FCPS, MRCP, FRCS, MS), and active institutional hospital affiliations. Our clinical regulatory operations team manually verifies these credentials directly against official databases before any doctor profile is approved.',
    },
    {
      q: 'Can I obtain a legally recognized electronic prescription after video consultation?',
      a: 'Yes. All video consultations on MedConnect are conducted with PMDC-registered specialists. Following your consultation, your doctor generates a digitally signed electronic prescription with their official PMDC registration number, diagnosis, dosage instructions, and lab advice. It is instantly delivered to your portal and sent via SMS.',
    },
    {
      q: 'Do I need an account to book an appointment or view doctor timings?',
      a: 'You can freely explore all doctor credentials, hospital schedules, specialties, consultation fees, and patient reviews on this landing page without creating an account. However, to reserve an appointment slot or attend a video consultation, a verified patient account with mobile confirmation is required to ensure medical record authenticity.',
    },
    {
      q: 'What payment options are supported in Pakistan?',
      a: 'MedConnect supports JazzCash, EasyPaisa, Visa, MasterCard, and Pay-at-Hospital Counter for in-clinic visits. Video consultations are prepaid securely via mobile wallets or cards with instant refund guarantee if an appointment cannot be fulfilled.',
    },
    {
      q: 'How do doctors join and manage their clinical practice?',
      a: 'Qualified clinicians can submit an application via the "Join as Clinician" link. Once verified by our operations team, you gain access to the Clinician Workspace to set OPD timetables, confirm or reschedule booking requests, conduct encrypted HD video visits, and manage patient records.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--canvas-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* =========================================================================
          TOP NAVIGATION BAR (CONSUMER PATIENT FOCUS - NO EXPOSED ADMIN)
         ========================================================================= */}
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
          zIndex: 40,
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
          <div className="logo-badge">+</div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px', display: 'block', color: '#FFF' }}>
              MedConnect
            </span>
            <span style={{ fontSize: '10px', color: 'var(--lime-accent)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Pakistan Healthcare
            </span>
          </div>
        </div>

        {/* Center Nav Links: Keep user on landing page with smooth scroll & info anchors */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
          <button
            type="button"
            onClick={() => scrollToSection('doctors')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Find Doctors
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('specialties')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Specialties
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('hospitals')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Hospital Clinics
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('telehealth')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Video Consult
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('faq')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            FAQ
          </button>

          <button
            type="button"
            onClick={() => navigate('/signup?role=doctor')}
            style={{
              color: 'var(--lime-accent)',
              fontSize: '13px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(197, 225, 165, 0.12)',
              border: '1px solid rgba(197, 225, 165, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Stethoscope size={13} />
            <span>Join as Clinician ↗</span>
          </button>
        </nav>

        {/* Right CTA Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          {/* User State: If logged in, show Quick Portal link. If guest, show Sign In & Register */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => {
                  if (currentUser.role === 'patient') navigate('/patient');
                  else if (currentUser.role === 'doctor') navigate('/doctor');
                  else if (currentUser.role === 'admin') navigate('/admin');
                }}
              >
                <UserCheck size={15} />
                <span>My Portal ({currentUser.name?.split(' ')[0]})</span>
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                style={{ padding: '8px 14px', fontSize: '12px', color: '#991B1B' }}
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => navigate('/login')}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '8px 20px', fontSize: '13px' }}
                onClick={() => navigate('/signup')}
              >
                <UserPlus size={14} />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 32px 64px 32px' }}>
        {/* =========================================================================
            SECTION 1: HERO CARD (EXACT CANVA DESIGN + OLADOC SEARCH)
           ========================================================================= */}
        <section id="hero" className="canva-hero-card" style={{ marginBottom: '40px' }}>
          {/* Geometric 8-Point Starburst Watermark from Canva */}
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

          {/* Live Online Doctor Status Badge */}
          <div className="hero-pill-badge">
            <span className="live-pulse-dot" style={{ backgroundColor: 'var(--lime-accent)' }}></span>
            <span>48 PMDC DOCTORS AVAILABLE ONLINE TODAY IN {selectedCity.name.toUpperCase()}</span>
          </div>

          <h1 className="hero-title">
            Pakistan's Most Trusted Digital Healthcare Network.
          </h1>

          <p className="hero-sub">
            Book priority in-clinic consultations at premier hospital networks or connect with PMDC-verified specialists via encrypted video in 15 minutes.
          </p>

          {/* Dual-Pill Interactive Search Bar */}
          <div style={{ maxWidth: '820px', width: '100%', position: 'relative', marginBottom: '24px' }}>
            <div className="oladoc-dual-search">
              {/* City Selector Trigger */}
              <div className="search-city-trigger" onClick={() => setIsCityModalOpen(true)}>
                <MapPin size={18} />
                <div className="search-city-text">
                  <span className="search-city-label">LOCATION</span>
                  <span className="search-city-val">{selectedCity.name} ▾</span>
                </div>
              </div>

              {/* Main Search Input */}
              <div className="search-input-wrap">
                <Search size={18} />
                <input
                  type="text"
                  className="search-main-input"
                  placeholder="Search by doctor name (e.g. Dr. Maya), specialty, or hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.length < 2) setSearchQuery('');
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Action Button: Scrolls to doctors section */}
              <button
                type="button"
                className="btn-search-action"
                onClick={() => scrollToSection('doctors')}
              >
                <span>Find Care</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Autocomplete Dropdown Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                <div className="suggestion-group-title">Matching Healthcare Results</div>
                {searchSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => {
                      if (item.filter) setSelectedSpecialtyFilter(item.filter);
                      setSearchQuery(item.label);
                      scrollToSection(item.targetId);
                    }}
                  >
                    <div className="suggestion-item-left">
                      <div className="suggestion-icon">
                        {item.type === 'Doctor' ? <Stethoscope size={15} /> : item.type === 'Specialty' ? <Sparkles size={15} /> : <Building2 size={15} />}
                      </div>
                      <div>
                        <div className="suggestion-name">{item.label}</div>
                        <div className="suggestion-sub">{item.sub}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--forest-700)', fontWeight: '700' }}>
                      View in {item.type}s →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-white-muted)' }}>Popular:</span>
            {['Cardiologist', 'Dermatologist', 'Gynecologist', 'Pediatrician', 'General Physician'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setSelectedSpecialtyFilter(chip);
                  scrollToSection('doctors');
                }}
                style={{
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Metrics & Trust Badges Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginTop: '40px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                500+
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                PMDC-Verified Doctors
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                150,000+
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                Successful Consultations
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                18+
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                Tertiary Hospital Partners
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                4.9 ★
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                Patient Satisfaction Score
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: PRIMARY HEALTHCARE SERVICES (OLADOC / MARHAM FLOW)
           ========================================================================= */}
        <section id="services" style={{ marginBottom: '56px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Healthcare Services at Your Fingertips</h2>
              <p>Explore comprehensive clinical services designed for quick booking and trusted medical care</p>
            </div>
          </div>

          <div className="services-grid">
            {/* Service 1: In-Clinic Visits */}
            <div className="service-card" onClick={() => scrollToSection('doctors')}>
              <div className="service-icon-box">
                <Building2 size={24} />
              </div>
              <h3 className="service-title">In-Clinic Hospital Visits</h3>
              <p className="service-desc">
                Book confirmed OPD appointments at top tertiary hospitals in Lahore, Karachi, and Islamabad with guaranteed minimum waiting time.
              </p>
              <div className="service-action-link">
                <span>View Hospital Timetables</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Service 2: Video Consult (Highlighted) */}
            <div className="service-card highlight" onClick={() => scrollToSection('telehealth')}>
              <div className="service-badge-live">
                <span className="live-pulse-dot"></span>
                <span>Instant 15-Min Response</span>
              </div>
              <div className="service-icon-box">
                <Video size={24} />
              </div>
              <h3 className="service-title">Online Video Consultations</h3>
              <p className="service-desc">
                Consult with verified medical specialists from the comfort of home. Receive an official digital PMDC prescription via SMS.
              </p>
              <div className="service-action-link">
                <span>Start Telehealth Visit</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Service 3: Lab Test Sampling */}
            <div className="service-card" onClick={() => scrollToSection('faq')}>
              <div className="service-icon-box">
                <Activity size={24} />
              </div>
              <h3 className="service-title">Home Lab Sampling</h3>
              <p className="service-desc">
                Certified phlebotomists collect blood samples at your doorstep with reports from Chughtai Lab, IDC, and Dr. Essa Lab directly in your portal.
              </p>
              <div className="service-action-link">
                <span>Learn About Labs</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Service 4: Chronic Disease Care */}
            <div className="service-card" onClick={() => scrollToSection('specialties')}>
              <div className="service-icon-box">
                <HeartPulse size={24} />
              </div>
              <h3 className="service-title">Chronic Disease Care</h3>
              <p className="service-desc">
                Dedicated management plans for hypertension, cardiac rehabilitation, diabetes, thyroid disorders, and hormonal wellness.
              </p>
              <div className="service-action-link">
                <span>Explore Care Programs</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: MEDICAL SPECIALTIES DIRECTORY (INTERACTIVE IN-PAGE FILTER)
           ========================================================================= */}
        <section id="specialties" style={{ marginBottom: '56px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Top Medical Specialties</h2>
              <p>Select a clinical specialty to immediately filter qualified doctors on this page</p>
            </div>
            {selectedSpecialtyFilter !== 'All' && (
              <button
                type="button"
                className="link-see-all"
                style={{ color: '#DC2626' }}
                onClick={() => setSelectedSpecialtyFilter('All')}
              >
                Clear Filter ({selectedSpecialtyFilter}) ✕
              </button>
            )}
          </div>

          <div className="specialties-grid">
            {SPECIALTIES.slice(0, 10).map((sp) => {
              const isSelected = selectedSpecialtyFilter.toLowerCase() === sp.name.toLowerCase();
              return (
                <div
                  key={sp.id}
                  className={`specialty-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedSpecialtyFilter(sp.name);
                    scrollToSection('doctors');
                  }}
                  style={{
                    backgroundColor: isSelected ? 'rgba(197, 225, 165, 0.25)' : '#FFFFFF',
                    borderColor: isSelected ? 'var(--forest-800)' : 'var(--border-subtle)',
                    borderWidth: isSelected ? '2px' : '1px',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? 'var(--forest-800)' : 'rgba(197, 225, 165, 0.35)',
                        color: isSelected ? '#FFFFFF' : 'var(--forest-800)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Stethoscope size={18} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-700)', fontFamily: 'serif' }}>
                      {sp.urdu}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '14.5px', fontWeight: '700', margin: '4px 0', color: 'var(--text-main)', textAlign: 'left', width: '100%' }}>
                    {sp.name}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: '1.4', textAlign: 'left', width: '100%' }}>
                    {sp.description}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', color: 'var(--forest-700)', fontWeight: '700' }}>
                    <span>Fee from Rs. 1,500</span>
                    <span>Filter Doctors ↓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: FEATURED DOCTORS SHOWCASE (IN-PAGE INSPECTION & BOOKING)
           ========================================================================= */}
        <section id="doctors" style={{ marginBottom: '56px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Featured PMDC-Certified Medical Specialists</h2>
              <p>
                Showing {filteredDoctors.length} verified specialists available for in-clinic visits and online consultations
              </p>
            </div>

            {/* Type Filter Pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setConsultationTypeFilter('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: `1.5px solid ${consultationTypeFilter === 'all' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: consultationTypeFilter === 'all' ? 'var(--forest-800)' : '#FFFFFF',
                  color: consultationTypeFilter === 'all' ? '#FFFFFF' : 'var(--text-main)',
                }}
              >
                All Consultations
              </button>

              <button
                type="button"
                onClick={() => setConsultationTypeFilter('clinic')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: `1.5px solid ${consultationTypeFilter === 'clinic' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: consultationTypeFilter === 'clinic' ? 'var(--forest-800)' : '#FFFFFF',
                  color: consultationTypeFilter === 'clinic' ? '#FFFFFF' : 'var(--text-main)',
                }}
              >
                🏥 In-Clinic Only
              </button>

              <button
                type="button"
                onClick={() => setConsultationTypeFilter('video')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: `1.5px solid ${consultationTypeFilter === 'video' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: consultationTypeFilter === 'video' ? 'var(--forest-800)' : '#FFFFFF',
                  color: consultationTypeFilter === 'video' ? '#FFFFFF' : 'var(--text-main)',
                }}
              >
                🎥 Video Consult Available
              </button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--forest-700)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Top Row: Avatar & Verified Badge */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: doc.photoColor || 'var(--forest-800)',
                      color: '#FFFFFF',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '18px',
                      fontWeight: '800',
                      flexShrink: 0,
                    }}
                  >
                    {doc.initials || doc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          color: '#15803D',
                          backgroundColor: '#DCFCE7',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ShieldCheck size={12} />
                        <span>PMDC: {doc.pmdcNumber}</span>
                      </span>
                      {doc.onlineNow && (
                        <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: '700' }}>● Online</span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '2px 0', color: 'var(--text-main)' }}>
                      {doc.name}
                    </h3>
                    <div style={{ fontSize: '12.5px', color: 'var(--forest-700)', fontWeight: '700' }}>
                      {doc.specialty}
                    </div>
                  </div>
                </div>

                {/* Qualifications & Experience */}
                <div style={{ margin: '14px 0', padding: '12px', backgroundColor: 'var(--canvas-bg)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-body)', fontWeight: '600', marginBottom: '4px' }}>
                    🎓 {doc.qualifications}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    <span>⏳ {doc.experience} Experience</span>
                    <span style={{ color: '#B45309', fontWeight: '700' }}>★ {doc.rating || 4.9} ({doc.reviewsCount || 120}+ reviews)</span>
                  </div>
                </div>

                {/* Main Hospital Practice */}
                <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginBottom: '16px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <MapPin size={15} color="var(--forest-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <b>{doc.practices?.[0]?.hospital || 'Executive OPD Clinic'}</b>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.practices?.[0]?.address || `${doc.city}, Pakistan`}</div>
                    </div>
                  </div>
                </div>

                {/* Consultation Fees */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Clinic Fee</span>
                    <b style={{ fontSize: '14px', color: 'var(--forest-800)' }}>Rs. {doc.inClinicFee?.toLocaleString() || '2,000'}</b>
                  </div>
                  {doc.videoFee && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>Video Consult</span>
                      <b style={{ fontSize: '14px', color: '#0369A1' }}>Rs. {doc.videoFee?.toLocaleString()}</b>
                    </div>
                  )}
                </div>

                {/* Action Buttons: 1. View Credentials on Landing Page, 2. Book with Auth Guard */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ padding: '9px 12px', fontSize: '12px', border: '1px solid var(--border-strong)' }}
                    onClick={() => setSelectedDoctorModal(doc)}
                  >
                    <span>View Credentials</span>
                  </button>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '9px 12px', fontSize: '12px' }}
                    onClick={() => handleBookingClick(doc)}
                  >
                    <span>Book Visit</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: PARTNER TERTIARY HOSPITALS (INTERACTIVE FACILITY INSPECTION)
           ========================================================================= */}
        <section id="hospitals" style={{ marginBottom: '56px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Premier Partner Hospital Networks</h2>
              <p>Top tertiary medical institutions and clinical complexes with MedConnect integration</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {branchesList.map((hosp) => (
              <div
                key={hosp.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(197, 225, 165, 0.4)',
                      color: 'var(--forest-800)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Building2 size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: 'var(--forest-700)',
                      backgroundColor: 'var(--canvas-bg)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    {hosp.city}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  {hosp.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  {hosp.address}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {hosp.departments?.slice(0, 3).map((dep, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        color: 'var(--text-body)',
                        backgroundColor: 'var(--canvas-bg)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {dep}
                    </span>
                  ))}
                  {hosp.beds && (
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--forest-700)' }}>
                      · {hosp.beds}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a
                    href={`tel:${hosp.emergencyHelpline || hosp.phone}`}
                    style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Phone size={13} />
                    <span>ER: {hosp.emergencyHelpline || hosp.phone}</span>
                  </a>

                  <button
                    type="button"
                    style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => setSelectedHospitalModal(hosp)}
                  >
                    <span>Facility Info</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: TELEHEALTH & REMOTE ENCRYPTED CARE
           ========================================================================= */}
        <section
          id="telehealth"
          style={{
            marginBottom: '56px',
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
            <div className="hero-pill-badge" style={{ marginBottom: '16px' }}>
              <Video size={13} />
              <span>OFFICIAL PMDC TELEHEALTH PLATFORM</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: '0 0 14px 0', lineHeight: '1.2' }}>
              Instant Video Consultations with Top Doctors across Pakistan
            </h2>

            <p style={{ fontSize: '14.5px', color: 'var(--text-white-muted)', margin: '0 0 28px 0', lineHeight: '1.6' }}>
              No matter where you are in Pakistan—from small towns to major metropolitan centers—consult senior professors and specialists via encrypted HD video.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>100% Encrypted Video</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>End-to-end clinical privacy conforming to international telehealth standards.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>Electronic PMDC Rx</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>Official digital prescription delivered to your phone and patient portal.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>JazzCash & EasyPaisa</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>Prepay effortlessly with Pakistani mobile wallets or debit/credit cards.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>48-Hour Free Follow-up</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>Ask follow-up questions to your doctor after lab results are ready.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => {
                setConsultationTypeFilter('video');
                scrollToSection('doctors');
              }}
            >
              <span>Find Video Doctors Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: HOW IT WORKS (TABBED INTERACTIVE WORKFLOW)
           ========================================================================= */}
        <section id="how-it-works" style={{ marginBottom: '56px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Clear, Transparent Healthcare Workflow</h2>
              <p>See how MedConnect interconnects patients, verified clinicians, and hospital care</p>
            </div>

            {/* Role Workflow Switcher */}
            <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-pill)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setHowItWorksTab('patient')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  backgroundColor: howItWorksTab === 'patient' ? 'var(--forest-800)' : 'transparent',
                  color: howItWorksTab === 'patient' ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                For Patients
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('doctor')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  backgroundColor: howItWorksTab === 'doctor' ? 'var(--forest-800)' : 'transparent',
                  color: howItWorksTab === 'doctor' ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                For Doctors & Clinicians
              </button>
            </div>
          </div>

          {howItWorksTab === 'patient' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  01
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Search & Select Specialist</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Explore PMDC-verified doctors by city, specialty, hospital affiliation, and patient satisfaction reviews.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  02
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Choose Clinic or Video Slot</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Select your convenient time slot. Sign in with your verified patient account to lock in your appointment request.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  03
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Doctor Confirms & Issues Rx</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Your doctor receives an immediate notification and confirms your slot. After your consultation, your official digital prescription is saved to your portal.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  01
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Submit PMDC License</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Register via the Clinician portal. Submit your PMDC license number, degrees, hospital affiliations, and consultation fees.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  02
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Operations Admin Verification</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  MedConnect operations administrators cross-verify your credentials with the Pakistan Medical & Dental Council within 24 hours.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  03
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Confirm Requests & Practice</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Once approved, patient booking requests arrive in your clinician queue. Confirm slots, conduct video visits, and issue electronic prescriptions.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 8: PATIENT TESTIMONIALS & TRUST REVIEWS
           ========================================================================= */}
        <section style={{ marginBottom: '56px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Real Experiences from Patients across Pakistan</h2>
              <p>Over 42,000 verified reviews from patients treated by our certified doctors</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', color: '#B45309', marginBottom: '10px' }}>
                {'★★★★★'}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                "Booking Dr. Maya Patel for an online video consultation was a lifesaver when my mother had sudden high blood pressure late in the evening. Within 10 minutes, we were talking to the doctor, and she gave clear instructions and a prescription."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--canvas-bg)', color: 'var(--forest-800)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '13px' }}>
                  AK
                </div>
                <div>
                  <b style={{ fontSize: '13px', display: 'block' }}>Alex Khan</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lahore · Verified Patient</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', color: '#B45309', marginBottom: '10px' }}>
                {'★★★★★'}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                "I visited Shifa International in Islamabad through MedConnect. My slot was pre-confirmed with Dr. Theo Williams. No standing in long hospital counters. The whole appointment went smoothly."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--canvas-bg)', color: 'var(--forest-800)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '13px' }}>
                  NB
                </div>
                <div>
                  <b style={{ fontSize: '13px', display: 'block' }}>Noman Bashir</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Islamabad · Verified Patient</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', color: '#B45309', marginBottom: '10px' }}>
                {'★★★★★'}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                "Dr. Sara Bilal at Hameed Latif helped manage my PCOS condition after multiple other doctors failed. Having my prescriptions and visit history saved neatly in one portal is wonderful."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--canvas-bg)', color: 'var(--forest-800)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '13px' }}>
                  MT
                </div>
                <div>
                  <b style={{ fontSize: '13px', display: 'block' }}>Madiha Tariq</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lahore · Verified Patient</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: FREQUENTLY ASKED QUESTIONS (INTERACTIVE ACCORDION)
           ========================================================================= */}
        <section id="faq" style={{ marginBottom: '56px' }}>
          <div className="section-header-row">
            <div className="section-heading-wrap">
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about PMDC validation, bookings, and digital healthcare</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '900px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '15px',
                      color: 'var(--text-main)',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--forest-800)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px 24px', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: '1.6' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: CLINICIAN RECRUITMENT CALLOUT
           ========================================================================= */}
        <section
          style={{
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
              Are you a qualified medical practitioner in Pakistan?
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-white-muted)', margin: 0, lineHeight: '1.6' }}>
              Expand your clinical consultation reach, manage in-clinic hospital timetables, and consult patients across Pakistan. Submit your PMDC license number for prompt verification by our operations team.
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            style={{ padding: '14px 28px', fontSize: '14px' }}
            onClick={() => navigate('/signup?role=doctor')}
          >
            <span>Apply as a Doctor</span>
            <ArrowRight size={17} />
          </button>
        </section>
      </main>

      {/* =========================================================================
          DISCREET FOOTER (CONSUMER HEALTHCARE DIRECTORY + HIDDEN ADMIN PORTAL)
         ========================================================================= */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-subtle)',
          padding: '48px 40px 28px 40px',
          marginTop: 'auto',
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '36px' }}>
            {/* Col 1: Brand Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="logo-badge" style={{ width: '32px', height: '32px', fontSize: '16px' }}>+</div>
                <b style={{ fontSize: '16px', color: 'var(--forest-800)' }}>MedConnect Pakistan</b>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: '1.6', margin: '0 0 14px 0' }}>
                Pakistan’s premier healthcare appointment network connecting patients with PMDC-verified doctors across 10 major cities for in-clinic visits and secure digital consultations.
              </p>
              <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700' }}>
                🚨 Medical Emergency Helpline: Call 1122 or visit nearest ER immediately.
              </div>
            </div>

            {/* Col 2: Top Specialties */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Specialties
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Cardiologist'); scrollToSection('doctors'); }}>Cardiologists</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Dermatologist'); scrollToSection('doctors'); }}>Dermatologists</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Gynecologist'); scrollToSection('doctors'); }}>Gynecologists</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Pediatrician'); scrollToSection('doctors'); }}>Pediatricians</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Gastroenterologist'); scrollToSection('doctors'); }}>Gastroenterologists</li>
              </ul>
            </div>

            {/* Col 3: Cities Covered */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Cities
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <li>Lahore (OPD & ER)</li>
                <li>Karachi (OPD & ER)</li>
                <li>Islamabad (OPD & ER)</li>
                <li>Rawalpindi</li>
                <li>Faisalabad</li>
              </ul>
            </div>

            {/* Col 4: Clinician Access */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Clinicians
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <li>
                  <button type="button" onClick={() => navigate('/signup?role=doctor')} style={{ color: 'var(--forest-800)', fontWeight: '700' }}>
                    Join as Clinician ↗
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/login?role=doctor')} style={{ color: 'var(--text-muted)' }}>
                    Doctor Portal Login
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('telehealth')} style={{ color: 'var(--text-muted)' }}>
                    Telehealth Guidelines
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright + Discreet Staff Gateway */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '12px',
            }}
          >
            <div>
              © 2026 MedConnect Pakistan Healthcare Platform. Designed following Oladoc flow & Canva specifications.
            </div>

            {/* Discreet Staff & Admin Access: Hidden from normal patient browsing, tucked into staff legal footer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/login?staff=true&role=admin')}
                style={{
                  color: 'var(--text-faint)',
                  fontSize: '11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--forest-800)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
                title="Restricted Hospital Administration Portal"
              >
                <Lock size={11} />
                <span>Hospital Staff & Operations Admin Gateway</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE MODAL 1: DOCTOR CREDENTIALS & PROFILE MODAL (ON LANDING PAGE)
         ========================================================================= */}
      {selectedDoctorModal && (
        <div className="modal-backdrop" onClick={() => setSelectedDoctorModal(null)}>
          <div
            className="modal-box"
            style={{ maxWidth: '640px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    backgroundColor: selectedDoctorModal.photoColor || 'var(--forest-800)',
                    color: '#FFF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '20px',
                    fontWeight: '800',
                  }}
                >
                  {selectedDoctorModal.initials}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>
                    {selectedDoctorModal.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: 'var(--forest-700)', fontWeight: '700' }}>
                    {selectedDoctorModal.specialty} · {selectedDoctorModal.city}
                  </div>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      color: '#15803D',
                      backgroundColor: '#DCFCE7',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                    }}
                  >
                    <ShieldCheck size={12} />
                    <span>Verified PMDC License #{selectedDoctorModal.pmdcNumber}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoctorModal(null)}
                style={{ padding: '6px', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Doctor Bio */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '6px' }}>
                About Clinician & Qualifications
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.6', margin: 0 }}>
                {selectedDoctorModal.bio || 'Consultant medical practitioner with extensive clinical experience across outpatient and inpatient care in Pakistan.'}
              </p>
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <b>Degrees:</b> {selectedDoctorModal.qualifications} · <b>Clinical Experience:</b> {selectedDoctorModal.experience}
              </div>
            </div>

            {/* Practice Timetables */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '8px' }}>
                Hospital OPD & Video Timetable
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedDoctorModal.practices?.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'var(--canvas-bg)',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12.5px',
                    }}
                  >
                    <div>
                      <b>{p.hospital}</b>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{p.address}</div>
                      <div style={{ color: 'var(--forest-700)', fontWeight: '600', marginTop: '2px' }}>
                        ⏰ {p.days}: {p.timing}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Fee</span>
                      <b style={{ color: 'var(--forest-800)', fontSize: '14px' }}>Rs. {p.fee?.toLocaleString()}</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Sample */}
            {selectedDoctorModal.reviews?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '8px' }}>
                  Verified Patient Feedback
                </h4>
                <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '12px', fontSize: '12.5px' }}>
                  <div style={{ color: '#B45309', marginBottom: '4px' }}>{'★★★★★'}</div>
                  <p style={{ margin: '0 0 6px 0', color: 'var(--text-body)', fontStyle: 'italic' }}>
                    "{selectedDoctorModal.reviews[0].comment}"
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    — {selectedDoctorModal.reviews[0].author} ({selectedDoctorModal.reviews[0].treatment})
                  </span>
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSelectedDoctorModal(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                style={{ flex: 2, padding: '12px' }}
                onClick={() => {
                  const doc = selectedDoctorModal;
                  setSelectedDoctorModal(null);
                  handleBookingClick(doc);
                }}
              >
                <span>Book with {selectedDoctorModal.name}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 2: HOSPITAL FACILITY DETAILS (ON LANDING PAGE)
         ========================================================================= */}
      {selectedHospitalModal && (
        <div className="modal-backdrop" onClick={() => setSelectedHospitalModal(null)}>
          <div
            className="modal-box"
            style={{ maxWidth: '600px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                  {selectedHospitalModal.city} PARTNER HOSPITAL
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0' }}>
                  {selectedHospitalModal.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHospitalModal(null)}
                style={{ padding: '6px', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={16} color="var(--forest-700)" />
                <span>{selectedHospitalModal.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="#DC2626" />
                <span>Emergency Hotline: <b>{selectedHospitalModal.emergencyHelpline || selectedHospitalModal.phone}</b></span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={16} color="var(--forest-700)" />
                <span>Timings: <b>{selectedHospitalModal.timings}</b></span>
              </div>
              {selectedHospitalModal.beds && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Building2 size={16} color="var(--forest-700)" />
                  <span>Bed Capacity: <b>{selectedHospitalModal.beds}</b> · Active Specialists: <b>{selectedHospitalModal.activeDoctors}</b></span>
                </div>
              )}
            </div>

            <h4 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '8px' }}>
              Available Clinical Departments
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
              {selectedHospitalModal.departments?.map((d, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: 'var(--canvas-bg)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                  }}
                >
                  {d}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="btn-lime-pill"
              style={{ width: '100%', padding: '12px' }}
              onClick={() => {
                setSelectedHospitalModal(null);
                setSearchQuery(selectedHospitalModal.name.split(' ')[0]);
                scrollToSection('doctors');
              }}
            >
              <span>View Specialists at this Hospital</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 3: AUTH REQUIRED MODAL (PROTECTING APPOINTMENT ENTRY)
         ========================================================================= */}
      {authRequiredModal.open && (
        <div className="modal-backdrop" onClick={() => setAuthRequiredModal({ open: false, doctor: null })}>
          <div
            className="modal-box"
            style={{ maxWidth: '480px', width: '92%', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <ShieldCheck size={28} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '0 0 8px 0' }}>
              Verified Patient Account Required
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
              In accordance with Pakistan healthcare regulations, booking an appointment with{' '}
              <b style={{ color: 'var(--forest-800)' }}>{authRequiredModal.doctor?.name}</b> requires a valid, mobile-verified patient account so your official medical record number (MRN) and digital prescription can be issued securely.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '12px', fontSize: '13.5px' }}
                onClick={() => {
                  const targetDoc = authRequiredModal.doctor;
                  navigate(`/signup?redirect=${encodeURIComponent(`/book?doctorId=${targetDoc?.id}&type=clinic`)}`);
                }}
              >
                <span>Create Verified Patient Account</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                style={{ padding: '12px', fontSize: '13.5px', border: '1px solid var(--border-strong)' }}
                onClick={() => {
                  const targetDoc = authRequiredModal.doctor;
                  navigate(`/login?redirect=${encodeURIComponent(`/book?doctorId=${targetDoc?.id}&type=clinic`)}`);
                }}
              >
                <LogIn size={15} />
                <span>Sign In to Existing Account</span>
              </button>

              <button
                type="button"
                style={{ padding: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}
                onClick={() => setAuthRequiredModal({ open: false, doctor: null })}
              >
                Continue Browsing Information
              </button>
            </div>
          </div>
        </div>
      )}

      {/* City Selector Modal */}
      <CitySelectorModal />
    </div>
  );
}
export { Landing };
