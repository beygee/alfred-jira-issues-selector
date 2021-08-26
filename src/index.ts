import './dotenv'
import alfy, { ScriptFilterItem } from 'alfy'
import { findIssues } from './lib/jira'

const alfredNotifier = require('alfred-notifier')

alfredNotifier()

const fetchWithCache = async (query: string) => {
  const cachedItems = alfy.cache.get<string, ScriptFilterItem[]>(query)
  if (cachedItems) return cachedItems

  const issues = await findIssues(query)

  const items = issues.map<ScriptFilterItem>((issue) => ({
    title: issue.key,
    subtitle: issue.summary,
    arg: issue.url,
  }))

  alfy.cache.set(query, items, { maxAge: 1000 * 60 * 60 })

  return items
}

const start = async () => {
  const query = alfy.input
  const items = await fetchWithCache(query)
  alfy.output(items)
}

start()
