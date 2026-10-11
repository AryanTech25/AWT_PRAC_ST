import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const blankStudent = {
  name: '', enrollment: '', email: '', courseId: '', semester: '5', gender: '', attendance: '80',
}

export default function StudentForm({ courses, student, students, onClose, onSave }) {
  const [form, setForm] = useState(blankStudent)
  const [error, setError] = useState('')

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name, enrollment: student.enrollment, email: student.email,
        courseId: student.courseId, semester: String(student.semester), gender: student.gender,
        attendance: String(student.attendance),
      })
    }
  }, [student])

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  function submit(event) {
    event.preventDefault()
    const name = form.name.trim()
    const enrollment = form.enrollment.trim().toUpperCase()
    const email = form.email.trim().toLowerCase()
    const semester = Number(form.semester)
    const attendance = Number(form.attendance)
    if (!name || !enrollment || !email || !form.courseId || !form.gender) {
      setError('Please complete all required fields.')
      return
    }
    if (!/^[A-Z0-9-]{4,20}$/.test(enrollment)) {
      setError('Use 4–20 letters, numbers, or hyphens for the enrollment number.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (students.some((item) => item.id !== student?.id && item.enrollment.toLowerCase() === enrollment.toLowerCase())) {
      setError('This enrollment number is already in use.')
      return
    }
    if (students.some((item) => item.id !== student?.id && item.email.toLowerCase() === email)) {
      setError('This email address is already in use.')
      return
    }
    if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
      setError('Semester must be between 1 and 8.')
      return
    }
    if (!Number.isFinite(attendance) || attendance < 0 || attendance > 100) {
      setError('Attendance must be between 0 and 100.')
      return
    }
    onSave({
      ...student,
      id: student?.id ?? `student-${Date.now()}`,
      name, enrollment, email, courseId: form.courseId, semester, gender: form.gender,
      attendance, createdAt: student?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="student-form-title">
        <div className="modal-heading"><div><span className="eyebrow">STUDENT RECORD</span><h2 id="student-form-title">{student ? 'Edit student' : 'Add a student'}</h2><p>Enter the student’s details below.</p></div><button className="icon-button" onClick={onClose} aria-label="Close form"><X size={19} /></button></div>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <label className="field field-full">Full name<input autoFocus name="name" value={form.name} onChange={update} placeholder="e.g. Aarya Shah" maxLength={60} /></label>
            <label className="field">Enrollment number<input name="enrollment" value={form.enrollment} onChange={update} placeholder="e.g. GSFC25CSE001" maxLength={20} /></label>
            <label className="field">Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="student@gsfcuniversity.ac.in" maxLength={100} /></label>
            <label className="field">Course<select name="courseId" value={form.courseId} onChange={update}><option value="">Select a course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select></label>
            <label className="field">Semester<select name="semester" value={form.semester} onChange={update}>{Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={index + 1}>Semester {index + 1}</option>)}</select></label>
            <label className="field">Gender<select name="gender" value={form.gender} onChange={update}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option></select></label>
            <label className="field">Attendance (%)<input name="attendance" type="number" min="0" max="100" step="1" value={form.attendance} onChange={update} /></label>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{student ? 'Save changes' : 'Add student'}</button></div>
        </form>
      </section>
    </div>
  )
}
