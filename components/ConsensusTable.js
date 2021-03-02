import Link from 'next/link'
import { formatLocation } from './Hotspots/utils'
import { Table, Typography } from 'antd'
import animalHash from 'angry-purple-tiger'
import ReactCountryFlag from 'react-country-flag'

const { Text } = Typography

export const makeArrayWorkWithAntTable = (incomingArray) => {
  return incomingArray.map((item, index) => ({ index, address: item }))
}

export const generateColumns = (columnType) => {
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
          <Link href={`/validators/${address}`}>
            <a style={{}}>{animalHash(address)}</a>
          </Link>
          {columnType === 'recent' && (
            <Text type="secondary" copyable>
              {address}
            </Text>
          )}
        </div>
      ),
    },
  ]

  return columns
}

const ConsensusTable = ({ dataSource, columns, loading }) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={{
        pageSize: 16,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
      scroll={{ x: true }}
    />
  )
}

export default ConsensusTable
