import { memo } from 'react'

function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>
}

export default memo(StatusBadge)
