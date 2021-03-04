import React from 'react'
import { capitalize } from 'lodash'
import { Tooltip } from 'antd'

function isRelay(listen_addrs) {
  return !!(
    listen_addrs &&
    listen_addrs.length > 0 &&
    listen_addrs[0].match('p2p-circuit')
  )
}

const black = '#000'
const green = '#29D391'
const yellow = '#FFC769'
const gray = '#ccc'

const circleColor = {
  relay: yellow,
  online: green,
  offline: gray,
}

const textColor = {
  relay: yellow,
  online: black,
  offline: black,
}

const tooltipTitle = {
  relay:
    'Validators operating behind a relay are not directly reachable and may degrade consensus performance',
  online: 'Validator is online',
  offline: 'Validator is offline',
}

function getStatus(online, listen_addrs) {
  if (isRelay(listen_addrs)) return 'relay'
  return online
}

const ValidatorStatus = ({
  status: { online, listen_addrs, height } = {
    online: null,
    listen_addrs: null,
    height: null,
  },
}) => {
  const status = getStatus(online, listen_addrs)

  return (
    <Tooltip title={tooltipTitle[status]}>
      <span
        style={{
          color: textColor[status],
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '10px',
            background: circleColor[status],
            display: 'inline-block',
            marginRight: '6px',
          }}
        />
        {capitalize(status)}
      </span>
    </Tooltip>
  )
}

export default ValidatorStatus
