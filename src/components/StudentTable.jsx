import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react'
import Avatar from './Avatar.jsx'
import StatusBadge from './StatusBadge.jsx'
import { getAttendanceStatus } from '../utils/attendance.js'

function StudentTable({ students, courses, onEdit, onDelete }) {
  const courseNames = new Map(courses.map((course) => [course.id, course.name]))

  if (!students.length) {
    return <div className="empty-state"><div className="empty-icon"><SearchIcon /></div><strong>No students found</strong><span>Try adjusting your search or filters.</span></div>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>STUDENT</th><th>ENROLLMENT NO.</th><th>COURSE / SEM</th><th>ATTENDANCE</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{students.map((student) => {
          const attendanceStatus = getAttendanceStatus(student.attendance)
          return (
            <tr key={student.id}>
              <td><Link to={`/students/${student.id}`} className="student-identity"><Avatar name={student.name} /><span><strong>{student.name}</strong><small>{student.email}</small></span></Link></td>
              <td><span className="mono-text">{student.enrollment}</span></td>
              <td><span className="course-cell">{courseNames.get(student.courseId) ?? 'Course unavailable'}</span><small className="table-subline">Semester {student.semester}</small></td>
              <td><span className="attendance-number">{student.attendance}%</span><div className="mini-progress"><span className={`progress-${attendanceStatus.tone}`} style={{ width: `${student.attendance}%` }} /></div></td>
              <td><StatusBadge tone={attendanceStatus.tone}>{attendanceStatus.label}</StatusBadge></td>
              <td><div className="row-actions"><Link className="row-action" to={`/students/${student.id}`} aria-label={`View ${student.name}`} title="View details"><ArrowUpRight size={16} /></Link><button className="row-action" onClick={() => onEdit(student)} aria-label={`Edit ${student.name}`} title="Edit"><Pencil size={15} /></button><button className="row-action row-action-danger" onClick={() => onDelete(student)} aria-label={`Delete ${student.name}`} title="Delete"><Trash2 size={15} /></button></div></td>
            </tr>
          )
        })}</tbody>
      </table>
    </div>
  )
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.2" /><path d="m15.4 15.4 4 4" /></svg>
}

export default memo(StudentTable)
