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
      dataIndex: 'index',
      key: 'index',
      render: (name, row, index) => index + 1,
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
      title: 'HNT Staked',
      dataIndex: 'stake',
      key: 'stake',
      render: (stake) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(stake / 100000000).toLocaleString()} HNT
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
      title: 'Location',
      dataIndex: 'geo',
      key: 'location',
      render: (geo) => {
        if (!geo || !geo.country_code) return null
        return (
          <p
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
          </p>
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
          <p
            style={{
              color: '#555',
            }}
          >
            {geo.isp}
          </p>
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
            <p
              style={{
                color: '#555',
              }}
            >
              {region}
            </p>
          )
        }
      },
    },
  ]

  return columns
}

const ValidatorsTable = ({ dataSource, loading }) => {
  const columns = generateColumns()

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={{
        pageSize: 100,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
      scroll={{ x: true }}
    />
  )
}

export default ValidatorsTable
