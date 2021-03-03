import React from 'react'
import { Tooltip } from 'antd'
import { uniqBy } from 'lodash'
import ReactCountryFlag from 'react-country-flag'

const ValidatorFlags = ({ validators }) => {
  const codes = validators
    .map((v) => ({
      code: v?.geo?.country_code,
      name: v?.geo?.country_name,
    }))
    .filter((c) => c.code)
  const uniqCodes = uniqBy(codes, 'code')

  return (
    <div style={{ display: 'flex' }}>
      {uniqCodes.map(({ code, name }) => {
        return (
          <Tooltip title={name} placement={'top'}>
            <ReactCountryFlag
              countryCode={code}
              style={{
                fontSize: '2em',
                marginLeft: '3px',
                marginRight: '3px',
                lineHeight: '2em',
              }}
            />
          </Tooltip>
        )
      })}
    </div>
  )
}

export default ValidatorFlags
