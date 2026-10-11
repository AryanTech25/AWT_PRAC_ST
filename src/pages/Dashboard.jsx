import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, ArrowUpRight, BookOpen, GraduationCap, Plus, Users } from 'lucide-react'
import Avatar from '../components/Avatar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { getAttendanceStatus } from '../utils/attendance.js'

const StatCard = memo(function StatCard({ icon: Icon, label, value, detail, trend, color }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span className={`stat-icon stat-icon-${color}`}><Icon size={19} strokeWidth={2} /></span><span className="stat-trend">{detail}</span></div>
      <div className="stat-value">{value}</div><div className="stat-label">{label}</div>
    </article>
  )
})

export default function Dashboard({ students, courses }) {
  const activeCourses = courses.filter((course) => course.status === 'Active').length
  const averageAttendance = useMemo(() => students.length ? Math.round(students.reduce((total, student) => total + Number(student.attendance), 0) / students.length) : 0, [students])
  const recentStudents = useMemo(() => [...students].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), [students])
  const courseNames = new Map(courses.map((course) => [course.id, course.name]))
  const eligible = students.filter((student) => student.attendance >= 75).length
  const attendancePercent = students.length ? Math.round((eligible / students.length) * 100) : 0

  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-orb welcome-orb-one" /><div className="welcome-orb welcome-orb-two" />
        <div className="welcome-copy"><span className="welcome-kicker"><span className="welcome-spark">✦</span> MONDAY, OCTOBER 12, 2026</span><h2>Your campus at a glance.</h2><p>Keep track of your students, courses, and academic progress.</p></div>
        <Link className="button welcome-button" to="/students"><Plus size={16} /> Add a student</Link>
        <div className="banner-decoration"><div className="banner-cap"><GraduationCap size={34} /></div><span className="banner-ring ring-one" /><span className="banner-ring ring-two" /></div>
      </div>

      <div className="section-heading stats-heading"><div><h2>Overview</h2><p>A snapshot of your academic community</p></div><span className="updated-tag"><span className="live-dot" /> LIVE DATA</span></div>
      <div className="stats-grid">
        <StatCard icon={Users} label="Total students" value={students.length.toLocaleString()} detail="On record" color="blue" />
        <StatCard icon={BookOpen} label="Total courses" value={courses.length.toLocaleString()} detail="In catalog" color="purple" />
        <StatCard icon={GraduationCap} label="Active courses" value={activeCourses.toLocaleString()} detail="Currently active" color="green" />
        <StatCard icon={Activity} label="Average attendance" value={`${averageAttendance}%`} detail={`${attendancePercent}% eligible`} color="orange" />
      </div>

      <div className="dashboard-lower">
        <section className="panel recent-panel">
          <div className="panel-heading"><div><h2>Recently registered</h2><p>Latest additions to your student body</p></div><Link className="text-link" to="/students">View all <ArrowRight size={15} /></Link></div>
          {recentStudents.length ? <div className="recent-list">{recentStudents.map((student) => {
            const status = getAttendanceStatus(student.attendance)
            return <Link className="recent-row" to={`/students/${student.id}`} key={student.id}><Avatar name={student.name} /><span className="recent-name"><strong>{student.name}</strong><small>{student.enrollment}</small></span><span className="recent-course">{courseNames.get(student.courseId) ?? 'Course unavailable'}</span><StatusBadge tone={status.tone}>{status.label}</StatusBadge><ArrowUpRight className="recent-arrow" size={16} /></Link>
          })}</div> : <div className="empty-state compact-empty"><strong>No students registered</strong><span>Add a student to see them here.</span></div>}
          <Link className="recent-mobile-link" to="/students">View all students <ArrowRight size={14} /></Link>
        </section>

        <section className="panel attendance-panel">
          <div className="panel-heading"><div><h2>Attendance pulse</h2><p>Eligibility across all students</p></div><span className="pulse-icon"><Activity size={18} /></span></div>
          <div className="pulse-content"><div className="donut" style={{ '--percent': `${attendancePercent}%` }}><div><strong>{attendancePercent}%</strong><span>eligible</span></div></div><div className="pulse-legend"><div><i className="legend-dot legend-green" /><span>Eligible <small>≥ 75%</small></span><strong>{eligible}</strong></div><div><i className="legend-dot legend-yellow" /><span>Warning <small>60–74%</small></span><strong>{students.filter((student) => student.attendance >= 60 && student.attendance < 75).length}</strong></div><div><i className="legend-dot legend-red" /><span>Detained <small>&lt; 60%</small></span><strong>{students.filter((student) => student.attendance < 60).length}</strong></div></div></div>
          <Link className="attendance-link" to="/attendance">Review attendance <ArrowRight size={15} /></Link>
        </section>
      </div>
      <section className="quick-actions">
        <div className="quick-copy"><span className="quick-star">✳</span><span><strong>Quick actions</strong><small>Jump into your daily tasks</small></span></div>
        <Link to="/students" className="quick-action"><span className="quick-action-icon quick-blue"><Users size={17} /></span><span><strong>Manage students</strong><small>View and update records</small></span><ArrowRight size={15} /></Link>
        <Link to="/courses" className="quick-action"><span className="quick-action-icon quick-violet"><BookOpen size={17} /></span><span><strong>Course catalog</strong><small>Manage course offerings</small></span><ArrowRight size={15} /></Link>
        <Link to="/attendance" className="quick-action"><span className="quick-action-icon quick-orange"><Activity size={17} /></span><span><strong>Check attendance</strong><small>View eligibility status</small></span><ArrowRight size={15} /></Link>
      </section>
    </>
  )
}
