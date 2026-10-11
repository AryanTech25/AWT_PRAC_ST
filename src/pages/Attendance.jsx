import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Search, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { getAttendanceStatus } from '../utils/attendance.js'

const filters = ['All students', 'Eligible', 'Warning', 'Detained']

export default function Attendance({ students, courses }) {
  const [filter, setFilter] = useState('All students')
  const [query, setQuery] = useState('')
  const courseNames = new Map(courses.map((course) => [course.id, course.name]))
  const counts = {
    Eligible: students.filter((student) => student.attendance >= 75).length,
    Warning: students.filter((student) => student.attendance >= 60 && student.attendance < 75).length,
    Detained: students.filter((student) => student.attendance < 60).length,
  }
  const average = students.length ? Math.round(students.reduce((sum, student) => sum + Number(student.attendance), 0) / students.length) : 0
  const filtered = useMemo(() => students.filter((student) => {
    const search = query.trim().toLowerCase()
    const status = getAttendanceStatus(student.attendance).label
    return (filter === 'All students' || status === filter) && (!search || [student.name, student.enrollment].some((value) => value.toLowerCase().includes(search)))
  }).sort((a, b) => a.attendance - b.attendance), [students, filter, query])

  return (
    <>
      <div className="attendance-summary-grid">
        <Summary icon={Activity} label="Average attendance" value={`${average}%`} caption="Across all registered students" color="blue" />
        <Summary icon={CheckCircle2} label="Eligible" value={counts.Eligible} caption="75% attendance or above" color="green" />
        <Summary icon={AlertTriangle} label="Warning" value={counts.Warning} caption="Between 60% and 74%" color="yellow" />
        <Summary icon={ShieldAlert} label="Detained" value={counts.Detained} caption="Below 60% attendance" color="red" />
      </div>
      <section className="panel directory-panel attendance-directory">
        <div className="panel-heading directory-heading"><div><h2>Student attendance</h2><p>Eligibility status based on overall attendance</p></div><span className="result-count">{filtered.length} records</span></div>
        <div className="attendance-controls"><div className="attendance-tabs" role="tablist" aria-label="Filter attendance by status">{filters.map((item) => <button role="tab" aria-selected={filter === item} className={`attendance-tab ${filter === item ? 'attendance-tab-active' : ''}`} key={item} onClick={() => setFilter(item)}>{item}{item !== 'All students' && <span>{counts[item]}</span>}</button>)}</div><label className="search-field attendance-search"><Search size={16} /><input aria-label="Search attendance" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a student..." /></label></div>
        {filtered.length ? <div className="table-wrap"><table className="data-table attendance-table"><thead><tr><th>STUDENT</th><th>COURSE</th><th>ATTENDANCE</th><th>ELIGIBILITY</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{filtered.map((student) => {
          const status = getAttendanceStatus(student.attendance)
          return <tr key={student.id}><td><Link to={`/students/${student.id}`} className="student-identity"><Avatar name={student.name} /><span><strong>{student.name}</strong><small>{student.enrollment}</small></span></Link></td><td><span className="course-cell">{courseNames.get(student.courseId) ?? 'Course unavailable'}</span></td><td><div className="attendance-cell"><span className="attendance-number">{student.attendance}%</span><div className="mini-progress"><span className={`progress-${status.tone}`} style={{ width: `${student.attendance}%` }} /></div></div></td><td><StatusBadge tone={status.tone}>{status.label}</StatusBadge></td><td><Link className="text-link" to={`/students/${student.id}`}>View details <span>→</span></Link></td></tr>
        })}</tbody></table></div> : <div className="empty-state"><strong>No attendance records found</strong><span>Try another filter or search term.</span></div>}
      </section>
      <div className="attendance-rules"><span className="rules-icon"><Activity size={17} /></span><span><strong>Attendance policy</strong><small>Eligibility requires at least 75% attendance. Students below 75% receive a warning; below 60% are marked detained.</small></span></div>
    </>
  )
}

function Summary({ icon: Icon, label, value, caption, color }) {
  return <article className="attendance-summary-card"><span className={`summary-icon summary-icon-${color}`}><Icon size={18} /></span><span className="summary-label">{label}</span><strong className="summary-value">{value}</strong><small>{caption}</small></article>
}
