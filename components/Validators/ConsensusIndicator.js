import { Tooltip } from 'antd'
import React from 'react'

const ConsensusIndicator = ({ address, recentGroups }) => {
  if (!recentGroups || recentGroups.length === 0) return null
  const lastGroups = recentGroups.slice(0, 5).reverse()
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontWeight: '500',
        whiteSpace: 'nowrap',
      }}
    >
      {lastGroups.map(({ members, height }) => {
        const elected = members.includes(address)
        return (
          <Tooltip
            title={elected ? 'In consensus' : 'Not in consensus'}
            key={`ci-${address}-${height}`}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '10px',
                background: elected ? '#9d6aee' : '#ccc',
                display: 'inline-block',
                marginRight: '6px',
              }}
            />
          </Tooltip>
        )
      })}
    </span>
  )
}

export default ConsensusIndicator
