import useSWR from 'swr'
import fetch from 'node-fetch'

const baseURL = 'https://testnet-api.helium.wtf/v1'

const url = (path, cursor) => {
  let fullURL = baseURL + path
  if (cursor) {
    fullURL += `?cursor=${cursor}`
  }
  return fullURL
}

const fetchAll = async (path, acc = [], cursor) => {
  const response = await fetch(url(path, cursor))
  const { data, cursor: nextCursor } = await response.json()
  const accData = [...acc, ...data]

  if (nextCursor) {
    const nextData = await fetchAll(path, accData, nextCursor)
    return nextData
  }

  return accData
}

export const fetchValidators = async () => {
  const response = await fetch('/api/validators')
  return response.json()
}

export const fetchCurrentValidators = async () => {}

export const useValidators = () => {
  const { data, error } = useSWR('validators', fetchValidators, {
    refreshInterval: 10000,
  })
  return {
    validators: data,
    isLoading: !error && !data,
    isError: error,
  }
}
