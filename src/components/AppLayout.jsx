import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity, BookOpen, GraduationCap, LayoutDashboard, Menu, Search, Users, X,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Students', to: '/students', icon: Users },
  { label: 'Courses', to: '/courses', icon: BookOpen },
  { label: 'Attendance', to: '/attendance', icon: Activity },
]

const pageTitles = {
  '/': ['Good morning, Admin', 'Here’s what’s happening across your campus today.'],
  '/students': ['Student management', 'Manage student records and academic profiles.'],
  '/courses': ['Course management', 'Organize courses, faculty, and departments.'],
  '/attendance': ['Attendance overview', 'Monitor attendance eligibility across your students.'],
}

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const detailPage = location.pathname.startsWith('/students/') && location.pathname !== '/students'
  const [title, subtitle] = detailPage ? ['Student profile', 'View academic details and attendance.'] : (pageTitles[location.pathname] ?? pageTitles['/'])

  return (
    <div className="app-shell">
      {menuOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={23} strokeWidth={2.3} /></div>
          <div><strong>Campus<span>Hub</span></strong><small>GSFC UNIVERSITY</small></div>
          <button className="icon-button sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>
              <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
              {label === 'Students' && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="semester-card">
            <div className="semester-icon"><BookOpen size={17} /></div>
            <div><strong>Academic year</strong><span>2026 – 2027</span></div>
            <span className="live-dot" />
          </div>
          <div className="profile-mini">
            <div className="admin-avatar">AD</div>
            <div className="admin-copy"><strong>Administrator</strong><span>Campus admin</span></div>
            <span className="profile-menu-dot">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{detailPage ? 'Students' : title.replace('Good morning, Admin', 'Dashboard')}</strong></div>
          <div className="topbar-actions">
            <Link className="top-search" aria-label="Search student records" to="/students"><Search size={16} /><span>Search records</span></Link>
            <div className="topbar-divider" />
            <div className="current-date"><span className="date-dot" />Academic session active</div>
            <div className="top-admin">AD</div>
          </div>
        </header>
        <section className="page-heading">
          <div><div className="eyebrow">GSFC UNIVERSITY <span>•</span> ACADEMIC PORTAL</div><h1>{title}</h1><p>{subtitle}</p></div>
          <div className="heading-date"><span className="date-calendar">◷</span><span>Academic year<br /><strong>2026 – 2027</strong></span></div>
        </section>
        <div className="page-content"><Outlet /></div>
        <footer className="app-footer"><span>© 2026 CampusHub</span><span>Built for GSFC University <span className="footer-heart">♥</span></span></footer>
      </main>
    </div>
  )
}
