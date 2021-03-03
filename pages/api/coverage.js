import { getCoverage } from '../../commonjs/coverage'
import { getCache } from '../../utils/cache'

export default async function handler(req, res) {
  const coverage = await getCache('coverage', getCoverage)
  res.status(200).send(coverage)
}
