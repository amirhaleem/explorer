import React from 'react'
import { capitalize } from 'lodash'

function isRelay(listen_addrs) {
  return !!(
    listen_addrs &&
    listen_addrs.length > 0 &&
    listen_addrs[0].match('p2p-circuit')
  )
}

function title(online, listen_addrs) {
  if (!online) return 'New'
  if (isRelay(listen_addrs)) {
    return 'Relay'
  }
  return capitalize(online)
}

const black = '#000'
const green = '#29D391'
const yellow = '#FFC769'

function color(online, listen_addrs) {
  if (isRelay(listen_addrs)) return yellow
  if (online === 'online') return green
  return yellow
}

function textColor(online, listen_addrs) {
  if (isRelay(listen_addrs)) return yellow
  if (online === 'online') return black
  return yellow
}

const ValidatorStatus = ({
  status: { online, listen_addrs, height } = {
    online: null,
    listen_addrs: null,
    height: null,
  },
}) => (
  <span
    style={{
      color: textColor(online, listen_addrs),
    }}
  >
    <span
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '10px',
        background: color(online, listen_addrs),
        display: 'inline-block',
        marginRight: '6px',
      }}
    />
    {title(online, listen_addrs)}
  </span>
)

export default ValidatorStatus
