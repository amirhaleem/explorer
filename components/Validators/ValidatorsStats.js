import React from 'react'
import { Card, Row, Col, Tooltip, Typography, Table, Collapse } from 'antd'
import { useStats } from '../../data/stats'
import { useElections } from '../../data/consensus'
import { formatDistanceToNow, format } from 'date-fns'
import Widget from '../Home/Widget'
import withBlockHeight from '../withBlockHeight'
import round from 'lodash/round'

const ValidatorsStats = ({ height, heightLoading }) => {
  const { isLoading: isLoadingStats, stats } = useStats()
  const { isLoading: isLoadingGroups, consensusGroups } = useElections()

  if (isLoadingStats || isLoadingGroups) return null

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} md={12} lg={8}>
        <Widget
          title="Election Times (1h)"
          value={`${round(
            stats.electionTimes.lastHour.avg / 60,
            1,
          ).toLocaleString()} min`}
          subtitle={`${round(
            stats.electionTimes.lastHour.stddev / 60,
            1,
          ).toLocaleString()} min std dev`}
        />
      </Col>
      <Col xs={24} md={12} lg={8}>
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
      <Col xs={24} md={12} lg={8}>
        <Widget
          title="Election Times (7d)"
          value={`${round(
            stats.electionTimes.lastWeek.avg / 60,
            1,
          ).toLocaleString()} min`}
          subtitle={`${round(
            stats.electionTimes.lastWeek.stddev / 60,
            1,
          ).toLocaleString()} min std dev`}
        />
      </Col>
      <Col xs={24} md={12} lg={8}>
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
      <Col xs={24} md={12} lg={8}>
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
      <Col xs={24} md={12} lg={8}>
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
