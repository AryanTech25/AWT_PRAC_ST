export function getAttendanceStatus(attendance) {
  if (attendance < 60) return { label: 'Detained', tone: 'danger' }
  if (attendance < 75) return { label: 'Warning', tone: 'warning' }
  return { label: 'Eligible', tone: 'success' }
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
