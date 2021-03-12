import React from 'react'
import { Tooltip } from 'antd'

const ValidatorVersion = ({ version }) => {
  if (!version) return null

  let versionPart = version
  if (version.match(/\+/)) {
    versionPart = version.split('+')[0]
  }

  if (!versionPart.match(/^\d+\.\d+\.\d+$/)) {
    return <Tooltip title={version}>other*</Tooltip>
  }

  if (versionPart !== version) {
    return <Tooltip title={version}>{versionPart}*</Tooltip>
  }

  return <span>{version}</span>
}

export default ValidatorVersion
