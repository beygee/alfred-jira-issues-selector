import './dotenv'
import alfy, { ScriptFilterItem } from 'alfy'
import { findIssues } from './lib/jira'

const IS_LOCAL = process.env.NODE_ENV === 'local'

const fetchWithCache = async (query: string) => {
  const cachedItems = alfy.cache.get<string, ScriptFilterItem[]>(query)
  if (cachedItems) return cachedItems

  const issues = await findIssues(query)

  const items = issues.map<ScriptFilterItem>((issue) => ({
    title: issue.key,
    subtitle: issue.summary,
    arg: issue.key,
  }))

  alfy.cache.set(query, items, { maxAge: 1000 * 5 })

  return items
}

const start = async () => {
  const query = alfy.input
  const items = await fetchWithCache(IS_LOCAL ? '108' : query.normalize('NFC'))

  alfy.output(items)
}

start()
