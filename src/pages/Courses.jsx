import { useMemo, useState } from 'react'
import { BookOpen, Plus, Search, Trash2, Users } from 'lucide-react'
import CourseForm from '../components/CourseForm.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Courses({ courses, students, onSave, onDelete }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const departments = [...new Set(courses.map((course) => course.department))]
  const filteredCourses = useMemo(() => {
    const search = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery = !search || [course.name, course.code, course.faculty, course.department].some((value) => value.toLowerCase().includes(search))
      return matchesQuery && (statusFilter === 'all' || course.status === statusFilter)
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [courses, query, statusFilter])

  return (
    <>
      <div className="page-toolbar"><div className="toolbar-copy"><span className="toolbar-icon toolbar-icon-violet"><BookOpen size={17} /></span><span><strong>{courses.length} courses</strong><small>{departments.length} departments · {courses.filter((course) => course.status === 'Active').length} active</small></span></div><button className="button button-primary" onClick={() => setFormOpen(true)}><Plus size={16} /> Add course</button></div>
      <section className="panel directory-panel">
        <div className="panel-heading directory-heading"><div><h2>Course catalog</h2><p>Explore course offerings and faculty assignments</p></div><span className="result-count">{filteredCourses.length} courses</span></div>
        <div className="filter-bar"><label className="search-field"><Search size={17} /><input aria-label="Search courses" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search course, code, faculty..." />{query && <button type="button" aria-label="Clear search" className="clear-search" onClick={() => setQuery('')}>×</button>}</label><label className="select-filter"><span>Status:</span><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option>Active</option><option>Inactive</option></select></label></div>
        {filteredCourses.length ? <div className="course-grid">{filteredCourses.map((course, index) => {
          const enrolled = students.filter((student) => student.courseId === course.id).length
          return <article className="course-card" key={course.id}><div className="course-card-top"><div className={`course-symbol course-symbol-${index % 4}`}><BookOpen size={19} /></div><StatusBadge tone={course.status === 'Active' ? 'success' : 'neutral'}>{course.status}</StatusBadge></div><span className="course-code">{course.code}</span><h3>{course.name}</h3><p className="course-dept">{course.department}</p><div className="course-meta"><span><span className="faculty-avatar">{course.faculty.split(' ').filter(Boolean).slice(-1)[0]?.[0] ?? 'F'}</span><span><small>Faculty</small><strong>{course.faculty}</strong></span></span><span className="credits-label"><small>CREDITS</small><strong>{course.credits}</strong></span></div><div className="course-card-footer"><span><Users size={14} /> {enrolled} enrolled</span><button className="course-delete" title={enrolled ? 'Cannot remove a course with enrolled students' : 'Delete course'} aria-label={`Delete ${course.name}`} onClick={() => onDelete(course)}><Trash2 size={15} /></button></div></article>
        })}</div> : <div className="empty-state"><div className="empty-icon"><Search size={22} /></div><strong>No courses found</strong><span>Try adjusting your search or filters.</span></div>}
      </section>
      <p className="page-note">Courses with enrolled students cannot be deleted. Reassign or remove students first.</p>
      {formOpen && <CourseForm courses={courses} onClose={() => setFormOpen(false)} onSave={(course) => { onSave(course); setFormOpen(false) }} />}
    </>
  )
}
