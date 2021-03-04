import React from 'react'
import Link from 'next/link'
import { Table, Typography } from 'antd'
import animalHash from 'angry-purple-tiger'
import ReactCountryFlag from 'react-country-flag'
import ValidatorStatus from './ValidatorStatus'

const { Text } = Typography

export const makeArrayWorkWithAntTable = (incomingArray) => {
  return incomingArray.map((item, index) => ({ index, address: item }))
}

export const generateColumns = () => {
  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      render: (num) => '#' + num,
      sorter: (a, b) => a.number - b.number,
      defaultSortOrder: 'desc',
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
      render: (stake) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(stake / 100000000).toLocaleString()} TNT
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
      dataIndex: 'elected',
      key: 'elected',
      sorter: (a, b) => a.elected - b.elected,
      sortDirections: ['descend'],
      render: (elected) => {
        if (!elected) return null
        return (
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              fontWeight: '500',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '10px',
                background: '#9d6aee',
                display: 'inline-block',
                marginRight: '6px',
              }}
            />
            In Consensus
          </span>
        )
      },
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
          <span
            style={{
              color: '#555',
            }}
          >
            {geo.isp}
          </span>
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
  const columns = generateColumns()

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
