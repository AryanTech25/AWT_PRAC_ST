import { useMemo, useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import StudentTable from '../components/StudentTable.jsx'
import StudentForm from '../components/StudentForm.jsx'

export default function Students({ students, courses, onSave, onDelete }) {
  const [query, setQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [studentToEdit, setStudentToEdit] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase()
    return students.filter((student) => {
      const matchesQuery = !search || [student.name, student.enrollment, student.email].some((value) => value.toLowerCase().includes(search))
      return matchesQuery && (courseFilter === 'all' || student.courseId === courseFilter)
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [students, query, courseFilter])

  function editStudent(student) {
    setStudentToEdit(student)
    setFormOpen(true)
  }

  function addStudent() {
    setStudentToEdit(null)
    setFormOpen(true)
  }

  function save(student) {
    onSave(student)
    setFormOpen(false)
  }

  return (
    <>
      <div className="page-toolbar"><div className="toolbar-copy"><span className="toolbar-icon toolbar-icon-blue"><Users size={17} /></span><span><strong>{students.length} students</strong><small>Student directory · 2026–27</small></span></div><button className="button button-primary" onClick={addStudent}><Plus size={16} /> Add student</button></div>
      <section className="panel directory-panel">
        <div className="panel-heading directory-heading"><div><h2>Student directory</h2><p>Search, filter, and manage student records</p></div><span className="result-count">{filteredStudents.length} results</span></div>
        <div className="filter-bar"><label className="search-field"><Search size={17} /><input aria-label="Search students" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, enrollment or email..." />{query && <button type="button" aria-label="Clear search" className="clear-search" onClick={() => setQuery('')}>×</button>}</label><label className="select-filter"><span>Course:</span><select aria-label="Filter by course" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}><option value="all">All courses</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}</select></label></div>
        <StudentTable students={filteredStudents} courses={courses} onEdit={editStudent} onDelete={onDelete} />
      </section>
      <p className="page-note">Student information is saved in this browser and remains available after you refresh.</p>
      {formOpen && <StudentForm courses={courses} student={studentToEdit} students={students} onClose={() => setFormOpen(false)} onSave={save} />}
    </>
  )
}
