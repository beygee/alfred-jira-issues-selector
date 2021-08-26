import axios from 'axios'
import { uniqBy } from 'lodash'
import queryString from 'query-string'
import {
  JiraIssue,
  JiraIssueWithKey,
  JiraIssueWithQuery,
} from './jira.interfaces'

const PROJECT = process.env.PROJECT_NAME
const DOMAIN = process.env.DOMAIN
const USER_EMAIL = process.env.USER_EMAIL
const API_TOKEN = process.env.API_TOKEN

const isNumeric = (data: string) => {
  return !isNaN(Number(data))
}

const createJql = (query: string) => {
  return {
    expand: ['names', 'schema', 'operations'],
    jql: PROJECT
      ? `project = ${PROJECT} AND text ~ "${query}" order by created desc`
      : `text ~ "${query}" order by created desc`,
    maxResults: 20,
    fieldsByKeys: false,
    fields: ['summary', 'status', 'assignee'],
    startAt: 0,
  }
}

export const findIssues = async (query: string) => {
  const [issuesWithQuery, issuesWithKey] = await Promise.all([
    findIssuesWithQuery(query),
    findIssuesWithKey(query),
  ])

  const issues = uniqBy(
    [
      ...issuesWithQuery.map<JiraIssue>((issue) => ({
        id: Number(issue.id),
        key: issue.key,
        summary: issue.fields.summary,
        url: `https://${DOMAIN}/browse/${issue.key}`,
      })),
      ...issuesWithKey.map<JiraIssue>((issue) => ({
        id: issue.id,
        key: issue.key,
        summary: issue.summaryText,
        url: `https://${DOMAIN}/browse/${issue.key}`,
      })),
    ],
    'id'
  )

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
    return []
  }
}

const findIssuesWithKey = async (query: string) => {
  if (!isNumeric(query)) return []
  try {
    const { data } = await axios({
      url: queryString.stringifyUrl({
        url: `https://${DOMAIN}/rest/api/3/issue/picker`,
        query: { query },
      }),
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${USER_EMAIL}:${API_TOKEN}`
        ).toString('base64')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return data.sections[0].issues as JiraIssueWithKey[]
  } catch (e) {
    return []
  }
}
