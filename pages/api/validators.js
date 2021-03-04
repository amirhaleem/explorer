import fetch from 'node-fetch'
import { getCache } from '../../utils/cache'
import { fetchAll } from '../../utils/pagination'

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const fetchGeo = (ipAddress) => async () => {
  const response = await fetch(
    `https://tools.keycdn.com/geo.json?host=${ipAddress}`,
    {
      headers: { 'User-Agent': 'keycdn-tools:https://explorer.helium.com' },
    },
  )
  const {
    data: { geo },
  } = await response.json()
  return geo
}

const getGeo = async (validator) => {
  const listenAddrs = validator?.status?.listen_addrs
  if (listenAddrs && listenAddrs.length > 0) {
    const match = listenAddrs[0].match(/\ip4\/(.*)\/tcp\/2154/)
    if (match) {
      const ipAddress = match[1]
      return getCache(`geo:${ipAddress}`, fetchGeo(ipAddress), {
        expires: false,
      })
    }
  }
}

const fetchValidators = async () => {
  const validators = await fetchAll('/validators')
  const elected = await fetchAll('/validators/elected')
  const electedAddresses = elected.map((e) => e.address)
  const validatorsWithGeo = []

  await asyncForEach(validators, async (v, i) => {
    const geo = await getGeo(v)
    validatorsWithGeo.push({
      ...v,
      geo: geo || {},
      elected: electedAddresses.includes(v.address),
      number: validators.length - i,
    })
  })

  return validatorsWithGeo
}

export default async function handler(req, res) {
  const validators = await fetchValidators()
  res.status(200).send(validators)
}
