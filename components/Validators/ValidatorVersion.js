import React from 'react'
import { Tooltip } from 'antd'

const ValidatorVersion = ({ version }) => {
  if (!version) return null

  if (version.match(/\+/)) {
    return <Tooltip title={version}>{version.split('+')[0]}*</Tooltip>
  }

  return <span>{version}</span>
}

export default ValidatorVersion
