import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, AtSign, BookOpen, CalendarDays, CheckCircle2, ClipboardList, GraduationCap, Hash, Mail, UserRound } from 'lucide-react'
import Avatar from '../components/Avatar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { getAttendanceStatus } from '../utils/attendance.js'

export default function StudentDetails({ students, courses, onEdit, onDelete }) {
  const { id } = useParams()
  const student = students.find((record) => record.id === id)
  if (!student) return <div className="panel not-found"><div className="empty-icon"><UserRound size={22} /></div><h2>Student not found</h2><p>This record may have been removed or the link is invalid.</p><Link className="button button-primary" to="/students"><ArrowLeft size={15} /> Back to students</Link></div>
  const course = courses.find((record) => record.id === student.courseId)
  const status = getAttendanceStatus(student.attendance)
  const statusText = status.label === 'Eligible' ? 'Attendance requirements met' : status.label === 'Warning' ? 'Attendance below the 75% requirement' : 'Attendance below the 60% detention threshold'

  return (
    <>
      <Link to="/students" className="back-link"><ArrowLeft size={16} /> Back to student directory</Link>
      <section className="profile-hero panel"><div className="profile-hero-main"><Avatar name={student.name} size="large" /><div><span className="eyebrow">STUDENT PROFILE</span><h2>{student.name}</h2><p>{student.enrollment}<span className="bullet-divider">•</span>Semester {student.semester}</p></div></div><div className="profile-hero-actions"><StatusBadge tone={status.tone}>{status.label}</StatusBadge><button className="button button-quiet" onClick={() => onEdit(student)}>Edit profile</button><button className="button button-danger-quiet" onClick={() => onDelete(student)}>Delete</button></div></section>
      <div className="detail-grid">
        <section className="panel detail-panel"><div className="panel-heading"><div><h2>Personal information</h2><p>Contact and enrollment details</p></div><span className="detail-panel-icon"><UserRound size={17} /></span></div><div className="detail-list"><Detail icon={Hash} label="Enrollment number" value={student.enrollment} mono /><Detail icon={Mail} label="Email address" value={student.email} /><Detail icon={UserRound} label="Gender" value={student.gender} /><Detail icon={CalendarDays} label="Semester" value={`Semester ${student.semester}`} /></div></section>
        <section className="panel detail-panel"><div className="panel-heading"><div><h2>Academic information</h2><p>Current course and attendance record</p></div><span className="detail-panel-icon detail-violet"><GraduationCap size={18} /></span></div><div className="detail-list"><Detail icon={BookOpen} label="Course" value={course?.name ?? 'Course unavailable'} /><Detail icon={ClipboardList} label="Course code" value={course?.code ?? '—'} mono /><Detail icon={AtSign} label="Department" value={course?.department ?? '—'} /><Detail icon={CalendarDays} label="Registration date" value={new Date(student.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} /></div></section>
      </div>
      <section className="panel attendance-detail-panel"><div className="attendance-detail-top"><div><span className="eyebrow">ATTENDANCE SUMMARY</span><h2>Overall attendance</h2><p>{statusText}</p></div><div className="attendance-score"><strong>{student.attendance}<small>%</small></strong><StatusBadge tone={status.tone}>{status.label}</StatusBadge></div></div><div className="large-progress"><span className={`progress-${status.tone}`} style={{ width: `${student.attendance}%` }} /></div><div className="attendance-scale"><span>0%</span><span className="threshold-label">Detained &lt;60%</span><span className="threshold-label">Required ≥75%</span><span>100%</span></div><div className="attendance-callout"><CheckCircle2 size={17} /><span>Minimum attendance requirement is <strong>75%</strong>. Students below <strong>60%</strong> may be detained.</span></div></section>
    </>
  )
}

function Detail({ icon: Icon, label, value, mono }) {
  return <div className="detail-item"><span className="detail-icon"><Icon size={16} /></span><span className="detail-label">{label}</span><strong className={mono ? 'mono-text' : ''}>{value}</strong></div>
}
