import React from 'react'
import Link from 'next/link'
import { Table, Typography, Tooltip } from 'antd'
import animalHash from 'angry-purple-tiger'
import ReactCountryFlag from 'react-country-flag'
import ValidatorStatus from './ValidatorStatus'
import ConsensusIndicator from './ConsensusIndicator'
import { truncate, upperCase } from 'lodash'
import { useElections } from '../../data/consensus'

const { Text } = Typography

export const makeArrayWorkWithAntTable = (incomingArray) => {
  return incomingArray.map((item, index) => ({ index, address: item }))
}

const formatISP = (isp) => {
  if (isp.match(/-/)) {
    return upperCase(isp.split('-')[0])
  }
  if (isp.length < 24 && isp.match(/,/)) {
    return upperCase(isp.split(',')[0])
  }
  return upperCase(
    truncate(isp, {
      length: 18,
      separator: ' ',
    }),
  )
}

export const generateColumns = (recentGroups) => {
  const columns = [
    {
      title: '#',
      dataIndex: 'number',
      key: 'number',
      render: (num) => '#' + num,
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: 'Validator Name',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {animalHash(address)}
        </div>
      ),
    },
    {
      title: 'TNT Staked',
      dataIndex: 'stake',
      key: 'stake',
      sorter: (a, b) => a.stake - b.stake,
      render: (stake) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(stake / 100000000).toLocaleString()} TNT
        </div>
      ),
    },
    {
      title: 'TNT Earned (30d)',
      dataIndex: 'rewards',
      key: 'rewards',
      sorter: (a, b) =>
        (a?.rewards?.month?.total || 0) - (b?.rewards?.month?.total || 0),
      sortDirections: ['descend'],
      render: (rewards) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rewards?.month?.total?.toLocaleString()} TNT
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ValidatorStatus status={status} />
        </div>
      ),
    },
    {
      title: 'Elected',
      dataIndex: 'address',
      key: 'elected',
      sorter: (a, b) => a.elected - b.elected,
      sortDirections: ['descend'],
      defaultSortOrder: 'desc',
      render: (address) => (
        <ConsensusIndicator address={address} recentGroups={recentGroups} />
      ),
    },
    {
      title: 'Location',
      dataIndex: 'geo',
      key: 'location',
      render: (geo) => {
        if (!geo || !geo.country_code) return null
        return (
          <span
            style={{
              color: '#555',
            }}
          >
            <ReactCountryFlag
              countryCode={geo.country_code}
              style={{
                fontSize: '1.5em',
                marginRight: '6px',
                lineHeight: '1.5em',
              }}
            />
            {[geo.city, geo.region_code, geo.country_code]
              .filter((g) => !!g)
              .join(', ')}
          </span>
        )
      },
    },
    {
      title: 'ISP',
      dataIndex: 'geo',
      key: 'isp',
      render: (geo) => {
        if (!geo || !geo.isp) return null
        return (
          <Tooltip
            title={geo.isp}
            style={{
              color: '#555',
            }}
          >
            {formatISP(geo.isp)}
          </Tooltip>
        )
      },
    },
    {
      title: 'Region',
      dataIndex: 'geo',
      key: 'region',
      render: (geo) => {
        if (!geo || !geo.rdns) return null
        const regionMatch = geo.rdns.match(
          /ec2-.*\.(.*)\.compute\.amazonaws\.com/,
        )
        if (regionMatch) {
          const region = regionMatch[1]
          return (
            <span
              style={{
                color: '#555',
              }}
            >
              {region}
            </span>
          )
        }
      },
    },
  ]

  return columns
}

const ValidatorsTable = ({ dataSource = [], loading }) => {
  const { consensusGroups } = useElections()
  const recentGroups = consensusGroups?.recentElections || []
  const columns = generateColumns(recentGroups)

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={{
        pageSize: 200,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
      scroll={{ x: true }}
    />
  )
}

export default ValidatorsTable
