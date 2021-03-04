import ReactMapboxGl, { Marker, ZoomControl } from 'react-mapbox-gl'
import { findBounds } from '../Txns/utils'
import animalHash from 'angry-purple-tiger'
import { Tooltip, Button } from 'antd'
import ReactCountryFlag from 'react-country-flag'
import { useRouter } from 'next/router'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useState } from 'react'
import { ReloadOutlined } from '@ant-design/icons'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  scrollZoom: false,
})

const styles = {
  consensusMember: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#474DFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
}

const ValidatorsMapbox = ({ validators = [] }) => {
  const router = useRouter()

  const validatorsWithLocation = validators.filter((v) => v?.geo?.latitude)

  const [mapBounds, setMapBounds] = useState(
    findBounds(
      validatorsWithLocation.map((m) => ({
        lng: m?.geo?.longitude,
        lat: m?.geo?.latitude,
      })),
    ),
  )

  const calculateBounds = () => {
    const memberLocations = []
    validatorsWithLocation.map((m) =>
      memberLocations.push({ lng: m?.geo?.longitude, lat: m?.geo?.latitude }),
    )
    setMapBounds(findBounds(memberLocations))
  }

  useDeepCompareEffect(() => {
    // only recalculate bounds if the consensus group changes (requires looking deeply at–i.e. comparing each item in—the dependency array)
    // otherwise (with a regular useEffect()) this would recalculate every time the data refreshes, resetting the user's zoom and pan every 10 seconds
    calculateBounds()
  }, [validators])

  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      containerStyle={{
        height: '600px',
        width: '100%',
      }}
      fitBounds={mapBounds}
      fitBoundsOptions={{
        padding: 100,
        animate: false,
      }}
      movingMethod="jumpTo"
    >
      <ZoomControl style={{ zIndex: 5 }} />
      {(validatorsWithLocation || []).map((m, idx) => {
        return (
          <Tooltip
            title={
              <>
                {animalHash(m.address)}{' '}
                <ReactCountryFlag
                  countryCode={m?.geo?.country_code}
                  style={{
                    fontSize: '1.5em',
                    marginLeft: '0 4px',
                    lineHeight: '1.5em',
                  }}
                />
              </>
            }
          >
            <Marker
              key={m.address}
              style={styles.consensusMember}
              anchor="center"
              className="consensus-mapbox-marker"
              coordinates={[m?.geo?.longitude, m?.geo?.latitude]}
              onClick={() => router.push(`/hotspots/${m.address}`)}
            >
              <span
                className="consensus-mapbox-hover-text"
                style={{
                  color: 'white',
                  textShadow: '0px 2px rgba(0,0,0,0.5)',
                  fontFamily: 'Inter',
                  fontWeight: 800,
                }}
              >
                {m.number}
              </span>
            </Marker>
          </Tooltip>
        )
      })}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          right: '12px',
        }}
      >
        <Tooltip title={`Reset zoom and pan`} placement={'bottomRight'}>
          <Button
            type="secondary"
            shape="circle"
            size={'small'}
            onClick={() => calculateBounds()}
            icon={<ReloadOutlined />}
          ></Button>
        </Tooltip>
      </div>
    </Mapbox>
  )
}
export default ValidatorsMapbox
