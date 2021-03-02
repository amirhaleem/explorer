import useSWR from 'swr'
import fetch from 'node-fetch'

// TODO add price list to helium-js #yolo
export const fetchOraclePrices = async () => {
  const prices = []
  const response0 = await fetch(
    'https://testnet-api.helium.wtf/v1/oracle/prices/',
  )
  const { data: data0, cursor: cursor0 } = await response0.json()
  prices.push(...data0)
  const response1 = await fetch(
    `https://testnet-api.helium.wtf/v1/oracle/prices?cursor=${cursor0}`,
  )
  const { data: data1, cursor: cursor1 } = await response1.json()
  prices.push(...data1)
  const response2 = await fetch(
    `https://testnet-api.helium.wtf/v1/oracle/prices?cursor=${cursor1}`,
  )
  return prices
}

export const useOraclePrices = (initialData) => {
  const fetcher = () => fetchOraclePrices()
  const { data, error } = useSWR('latestOraclePrices', fetcher, {
    initialData,
    refreshInterval: 10000,
  })
  return {
    oraclePrices: data,
    isLoading: !error && !data,
    isError: error,
  }
}
