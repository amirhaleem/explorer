import React from 'react'
import { countBy } from 'lodash'
import { Tooltip } from 'antd'

const makePercent = (count, total) => (count / total) * 100 + '%'

const green = '#29D391'
const yellow = '#FFC769'
const gray = '#ccc'

const versionColor = (version, index) => {
  if (version === '1') return gray
  if (index > 0) return yellow
  return green
}

const VersionProgress = ({ validators }) => {
  const versionCounts = countBy(validators, 'version_heartbeat')
  const totalValidators = validators.length

  return (
    <div
      style={{
        display: 'flex',
        height: 20,
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 15,
        marginBottom: 15,
      }}
    >
      {Object.keys(versionCounts)
        .sort()
        .reverse()
        .map((version, i) => (
          <Tooltip title={`${version} (${versionCounts[version]})`}>
            <div
              key={version}
              style={{
                background: versionColor(version, i),
                width: makePercent(versionCounts[version], totalValidators),
                marginRight: 1,
              }}
            />
          </Tooltip>
        ))}
    </div>
  )
}

export default VersionProgress
