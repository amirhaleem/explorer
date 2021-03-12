import React from 'react'
import { Card, Row, Col, Tooltip, Typography, Table, Collapse } from 'antd'
import { differenceInDays } from 'date-fns'
import { round, clamp } from 'lodash'
import { useStats } from '../../data/stats'
import { useElections } from '../../data/consensus'
import { useValidators } from '../../data/validators'
import { formatDistanceToNow, format } from 'date-fns'
import Widget from '../Home/Widget'
import withBlockHeight from '../withBlockHeight'

const calculateValidatorAPY = (numValidators) => {
  const preHalvingTokensPerDay = 300000 / 30
  const postHalvingTokensPerDay = preHalvingTokensPerDay / 2
  const daysTilHalving = clamp(
    differenceInDays(new Date('2021-08-01'), new Date()),
    0,
    365,
  )
  const daysAfterHalving = 365 - daysTilHalving
  const blendedTokensPerDay =
    preHalvingTokensPerDay * daysTilHalving +
    daysAfterHalving * postHalvingTokensPerDay
  const annualTokensPerValidator = blendedTokensPerDay / numValidators
  const stake = 10000

  return round((annualTokensPerValidator / stake) * 100, 2)
}

const ValidatorsStats = ({ height, heightLoading }) => {
  const { isLoading: isLoadingStats, stats } = useStats()
  const { isLoading: isLoadingGroups, consensusGroups } = useElections()
  const { isLoading: isLoadingValidators, validators } = useValidators()

  if (isLoadingStats || isLoadingGroups || isLoadingValidators) return null

  const totalStaked = stats?.validators?.staked?.amount || 0
  const activeValidators = validators.filter(
    (v) => v?.status?.online === 'online',
  ).length

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Total Validators"
          value={validators.length.toLocaleString()}
          subtitle={`${activeValidators.toLocaleString()} Online`}
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Consensus Group Size"
          value={validators.filter((v) => v.elected).length.toLocaleString()}
          subtitle={`${validators
            .filter((v) => v.elected && v?.status?.online === 'online')
            .length.toLocaleString()} Online`}
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Total Staked"
          value={`${totalStaked.toLocaleString()} TNT`}
          subtitle={`${round(
            (totalStaked / stats.circulatingSupply) * 100,
            4,
          )}% of Supply`}
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Estimated APY (HNT)"
          value={`${calculateValidatorAPY(activeValidators)}%`}
          subtitle={`${activeValidators.toLocaleString()} active validators`}
          tooltip={`Pre-halving, 300k HNT per month on average is distributed between active consensus members`}
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Election Times (24h)"
          value={`${round(
            stats.electionTimes.lastDay.avg / 60,
            1,
          ).toLocaleString()} min`}
          subtitle={`${round(
            stats.electionTimes.lastDay.stddev / 60,
            1,
          ).toLocaleString()} min std dev`}
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Election Times (30d)"
          value={`${round(
            stats.electionTimes.lastMonth.avg / 60,
            1,
          ).toLocaleString()} min`}
          subtitle={`${round(
            stats.electionTimes.lastMonth.stddev / 60,
            1,
          ).toLocaleString()} min std dev`}
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Time since last election"
          value={formatDistanceToNow(
            new Date(consensusGroups.recentElections[0].time * 1000),
          )}
          subtitle={`Last election: ${format(
            new Date(consensusGroups.recentElections[0].time * 1000),
            'h:mm aaaa, MMM d',
          )}`}
          tooltip="Time elapsed since the most recent consensus election transaction"
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Widget
          title="Blocks since last election"
          value={
            !heightLoading
              ? `${height - consensusGroups.recentElections[0].height}`
              : 'Loading...'
          }
          subtitle={`Current height: ${
            !heightLoading ? `${height.toLocaleString()}` : `Loading...`
          }`}
          tooltip="The current block height minus the block height of the most recent consensus election transaction"
        />
      </Col>
    </Row>
  )
}

export default withBlockHeight(ValidatorsStats)
