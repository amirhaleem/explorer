import React from 'react'
import { Card } from 'antd'
import AppLayout, { Content } from '../components/AppLayout'
import { useValidators } from '../data/validators'
import dynamic from 'next/dynamic'
import TopBanner from '../components/AppLayout/TopBanner'
import ValidatorImg from '../public/images/validator.svg'
import ValidatorsTable from '../components/Validators/ValidatorsTable'
import ValidatorsStats from '../components/Validators/ValidatorsStats'
import ValidatorFlags from '../components/Validators/ValidatorFlags'

const Map = dynamic(() => import('../components/Validators/ValidatorsMapbox'), {
  ssr: false,
  loading: () => (
    <span style={{ minHeight: 600, backgroundColor: '#324b61' }} />
  ),
})

const Consensus = () => {
  const { validators } = useValidators()

  return (
    <AppLayout
      title={'Validators'}
      description={
        'The current and most recent hotspots that have been elected to be part of a consensus group'
      }
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/consensus.png`}
      url={`https://explorer.helium.com/consensus`}
    >
      <TopBanner icon={ValidatorImg} title="Validators" />
      <div
        style={{ minHeight: 600, width: '100%', backgroundColor: '#324b61' }}
      >
        <Map validators={validators} />
      </div>
      <div
        style={{
          width: '100%',
          padding: '0px 0',
          backgroundColor: 'rgb(24, 32, 53)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ValidatorFlags validators={validators} />
      </div>
      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1400,
          padding: '40px 20px 100px',
        }}
      >
        <ValidatorsStats />
        <Card style={{ marginBottom: 24 }}>
          <ValidatorsTable dataSource={validators} />
        </Card>
      </Content>
    </AppLayout>
  )
}

export default Consensus