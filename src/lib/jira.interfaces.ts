export interface JiraIssueWithKey {
  id: number
  key: string
  keyHtml: string
  img: string
  summary: string
  summaryText: string
}

export interface JiraIssueWithQuery {
  id: string
  key: string
  fields: {
    summary: string
  }
}

export interface JiraIssue {
  id: number
  key: string
  summary: string
  url: string
}
