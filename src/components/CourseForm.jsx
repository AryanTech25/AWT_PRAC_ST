import { useState } from 'react'
import { X } from 'lucide-react'

const blankCourse = { name: '', code: '', faculty: '', credits: '3', department: '', status: 'Active' }

export default function CourseForm({ courses, onClose, onSave }) {
  const [form, setForm] = useState(blankCourse)
  const [error, setError] = useState('')

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  function submit(event) {
    event.preventDefault()
    const name = form.name.trim()
    const code = form.code.trim().toUpperCase()
    const faculty = form.faculty.trim()
    const department = form.department.trim()
    const credits = Number(form.credits)
    if (!name || !code || !faculty || !department) {
      setError('Please complete all required fields.')
      return
    }
    if (!/^[A-Z0-9-]{2,12}$/.test(code)) {
      setError('Course code must be 2–12 letters, numbers, or hyphens.')
      return
    }
    if (courses.some((course) => course.code.toLowerCase() === code.toLowerCase())) {
      setError('A course with this code already exists.')
      return
    }
    if (!Number.isInteger(credits) || credits < 1 || credits > 6) {
      setError('Credits must be a whole number from 1 to 6.')
      return
    }
    onSave({ id: `course-${Date.now()}`, name, code, faculty, credits, department, status: form.status })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="course-form-title">
        <div className="modal-heading"><div><span className="eyebrow">COURSE CATALOG</span><h2 id="course-form-title">Add a course</h2><p>Create a course record for the academic catalog.</p></div><button className="icon-button" onClick={onClose} aria-label="Close form"><X size={19} /></button></div>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <label className="field field-full">Course name<input autoFocus name="name" value={form.name} onChange={update} placeholder="e.g. B.Tech Computer Science" maxLength={80} /></label>
            <label className="field">Course code<input name="code" value={form.code} onChange={update} placeholder="e.g. BT-CS" maxLength={12} /></label>
            <label className="field">Faculty<input name="faculty" value={form.faculty} onChange={update} placeholder="e.g. Dr. R. Mehta" maxLength={60} /></label>
            <label className="field">Department<input name="department" value={form.department} onChange={update} placeholder="e.g. Computer Science" maxLength={60} /></label>
            <label className="field">Credits<select name="credits" value={form.credits} onChange={update}>{[1, 2, 3, 4, 5, 6].map((credit) => <option key={credit} value={credit}>{credit} credits</option>)}</select></label>
            <label className="field">Status<select name="status" value={form.status} onChange={update}><option>Active</option><option>Inactive</option></select></label>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">Add course</button></div>
        </form>
      </section>
    </div>
  )
}
