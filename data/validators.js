import useSWR from 'swr'
import fetch from 'node-fetch'

export const fetchValidators = async () => {
  const response = await fetch('/api/validators')
  return response.json()
}

export const useValidators = (initialData) => {
  const { data, error } = useSWR('validators', fetchValidators, {
    refreshInterval: 10000,
    initialData,
  })
  return {
    validators: data || [],
    isLoading: !error && !data,
    isError: error,
  }
}
