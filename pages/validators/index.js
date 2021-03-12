import React from 'react'
import { Card } from 'antd'
import AppLayout, { Content } from '../../components/AppLayout'
import { useValidators } from '../../data/validators'
import { fetchValidators } from '../../pages/api/validators'
import dynamic from 'next/dynamic'
import TopBanner from '../../components/AppLayout/TopBanner'
import ValidatorImg from '../../public/images/validator.svg'
import ValidatorsTable from '../../components/Validators/ValidatorsTable'
import ValidatorsStats from '../../components/Validators/ValidatorsStats'
import ValidatorFlags from '../../components/Validators/ValidatorFlags'

const Map = dynamic(
  () => import('../../components/Validators/ValidatorsMapbox'),
  {
    ssr: false,
    loading: () => (
      <span style={{ minHeight: 600, backgroundColor: '#324b61' }} />
    ),
  },
)

const Consensus = ({ validators: initialValidators }) => {
  const { validators } = useValidators(initialValidators)
  const elected = (validators || []).filter((v) => v.elected)

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
        <Map validators={elected} />
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
        <ValidatorFlags validators={elected} />
      </div>
      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1500,
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

export async function getStaticProps() {
  const validators = await fetchValidators()

  return {
    props: {
      validators: JSON.parse(JSON.stringify(validators)),
    },
    revalidate: 10,
  }
}

export default Consensus
