import { initialCourses, initialStudents } from '../data/seedData.js'

const STUDENTS_KEY = 'campushub_students_v1'
const COURSES_KEY = 'campushub_courses_v1'

function readRecords(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    if (!saved) return fallback
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (error) {
    console.error(`Could not read ${key} from localStorage.`, error)
    return fallback
  }
}

export function loadStudents() {
  return readRecords(STUDENTS_KEY, initialStudents)
}

export function loadCourses() {
  return readRecords(COURSES_KEY, initialCourses)
}

export function saveStudents(students) {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  } catch (error) {
    console.error('Could not save student records to localStorage.', error)
  }
}

export function saveCourses(courses) {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
  } catch (error) {
    console.error('Could not save course records to localStorage.', error)
  }
}
