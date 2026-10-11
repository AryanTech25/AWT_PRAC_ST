import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import StudentForm from './components/StudentForm.jsx'
import Attendance from './pages/Attendance.jsx'
import Courses from './pages/Courses.jsx'
import Dashboard from './pages/Dashboard.jsx'
import StudentDetails from './pages/StudentDetails.jsx'
import Students from './pages/Students.jsx'
import { loadCourses, loadStudents, saveCourses, saveStudents } from './utils/storage.js'

export default function App() {
  const [students, setStudents] = useState(loadStudents)
  const [courses, setCourses] = useState(loadCourses)
  const [editingStudent, setEditingStudent] = useState(null)
  const [notice, setNotice] = useState(null)
  const navigate = useNavigate()

  useEffect(() => saveStudents(students), [students])
  useEffect(() => saveCourses(courses), [courses])
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(null), 3600)
    return () => window.clearTimeout(timer)
  }, [notice])

  function showNotice(message, tone = 'success') {
    setNotice({ message, tone, key: Date.now() })
  }

  function saveStudent(student) {
    setStudents((current) => current.some((item) => item.id === student.id)
      ? current.map((item) => item.id === student.id ? student : item)
      : [student, ...current])
    setEditingStudent(null)
    showNotice(`Student ${student.name} ${students.some((item) => item.id === student.id) ? 'updated' : 'added'} successfully.`)
  }

  function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name} (${student.enrollment})? This action cannot be undone.`)) return
    setStudents((current) => current.filter((item) => item.id !== student.id))
    setEditingStudent(null)
    showNotice(`${student.name} was removed from the student directory.`)
    navigate('/students')
  }

  function saveCourse(course) {
    setCourses((current) => [...current, course])
    showNotice(`${course.name} was added to the course catalog.`)
  }

  function deleteCourse(course) {
    const enrolledCount = students.filter((student) => student.courseId === course.id).length
    if (enrolledCount) {
      showNotice(`Cannot delete ${course.code}: ${enrolledCount} student${enrolledCount === 1 ? ' is' : 's are'} enrolled.`, 'error')
      return
    }
    if (!window.confirm(`Delete the ${course.code} course? This action cannot be undone.`)) return
    setCourses((current) => current.filter((item) => item.id !== course.id))
    showNotice(`${course.code} was removed from the course catalog.`)
  }

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard students={students} courses={courses} />} />
          <Route path="students" element={<Students students={students} courses={courses} onSave={saveStudent} onDelete={deleteStudent} />} />
          <Route path="students/:id" element={<StudentDetails students={students} courses={courses} onEdit={setEditingStudent} onDelete={deleteStudent} />} />
          <Route path="courses" element={<Courses courses={courses} students={students} onSave={saveCourse} onDelete={deleteCourse} />} />
          <Route path="attendance" element={<Attendance students={students} courses={courses} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {editingStudent && <StudentForm courses={courses} student={editingStudent} students={students} onClose={() => setEditingStudent(null)} onSave={saveStudent} />}
      {notice && <div className={`toast toast-${notice.tone}`} key={notice.key} role={notice.tone === 'error' ? 'alert' : 'status'}><span className="toast-indicator">{notice.tone === 'error' ? '!' : '✓'}</span>{notice.message}<button aria-label="Dismiss message" onClick={() => setNotice(null)}>×</button></div>}
    </>
  )
}
