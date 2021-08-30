import axios from 'axios'
import { JiraIssue, JiraIssueWithQuery } from './jira.interfaces'

const PROJECT = process.env.PROJECT_NAME
const DOMAIN = process.env.DOMAIN
const USER_EMAIL = process.env.USER_EMAIL
const API_TOKEN = process.env.API_TOKEN
const MY_ISSUE = process.env.MY_ISSUE

const createJql = (query: string) => {
  let jql = ``
  let querySum = 0
  const addQueryBuilder = (qb: string) => {
    if (querySum === 0) jql += qb
    else jql += ` AND (${qb})`
    querySum++
  }
  const orQueryBuilder = (qb: string) => {
    if (querySum === 0) jql += qb
    else jql += ` OR (${qb})`
    querySum++
  }

  if (query) addQueryBuilder(`text ~ "${query}"`)

  if (PROJECT) {
    addQueryBuilder(`project = ${PROJECT}`)
    if (query) orQueryBuilder(`key = "${PROJECT}-${query}"`)
  }

  if (MY_ISSUE) addQueryBuilder(`assignee = currentUser()`)

  jql += ` order by created desc`

  return {
    expand: ['names', 'schema', 'operations'],
    jql,
    maxResults: 20,
    fieldsByKeys: false,
    validateQuery: 'warn',
    fields: ['summary'],
    startAt: 0,
  }
}

export const findIssues = async (query: string) => {
  const issuesWithQuery = await findIssuesWithQuery(query)

  const issues = issuesWithQuery.map<JiraIssue>((issue) => ({
    id: Number(issue.id),
    key: issue.key,
    summary: issue.fields.summary,
    url: `https://${DOMAIN}/browse/${issue.key}`,
  }))

  return issues
}

const findIssuesWithQuery = async (query: string) => {
  try {
    const { data } = await axios({
      url: `https://${DOMAIN}/rest/api/3/search`,
      method: 'POST',
      data: createJql(query),
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${USER_EMAIL}:${API_TOKEN}`
        ).toString('base64')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return data.issues as JiraIssueWithQuery[]
  } catch (e) {
    console.error(e)
    return []
  }
}
