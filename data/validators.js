import useSWR from 'swr'
import fetch from 'node-fetch'

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
