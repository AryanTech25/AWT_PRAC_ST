import { memo } from 'react'
import { getInitials } from '../utils/attendance.js'

function Avatar({ name, size = 'normal' }) {
  return <span className={`avatar avatar-${size}`} aria-label={name}>{getInitials(name)}</span>
}

export default memo(Avatar)
