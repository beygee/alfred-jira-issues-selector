# Alfred Jira Issue Selector Workflow

<center>
    <a href="https://npmjs.org/package/alfred-jira-issues-selector">
        <img src="https://img.shields.io/npm/v/alfred-jira-issues-selector.svg"/>
    </a>
</center>

## Install

> Requires Node.js 7.6+ and the Alfred Powerpack.

```shell
$ npm install -g alfred-jira-issues-selector
```

Or
Download workflow on this [URL](http://www.packal.org/workflow/jira-issues-selector)

And then You must set the variable.

![4](https://user-images.githubusercontent.com/7090906/131052768-22f0047e-63e1-4b3c-aded-cb8a735ce590.png)

```
API_TOKEN= jira api token.
DOMAIN= your jira domain.
USER_EMAIL= your jira email.
PROJECT_NAME= (optional) your jira project key.
```

- GET API_TOKEN on [this page.](https://id.atlassian.com/manage-profile/security/api-tokens)
- If you write `PROJECT_NAME`, only the issues of that project are searched.

![5](https://user-images.githubusercontent.com/7090906/131052355-e673c570-3320-4f58-ba84-1a8cbb2ffdfe.png)

## Usage

```
jr [query]
```

```
jr 36 // Find By Issue Key
```

```
jr 이슈 // Find By Issue Summary or Description Content
```

Press <kbd>return</kbd> (↵): Copy the Clipboard.
Press <kbd>ctrl or command</kbd> + <kbd>return</kbd> (↵): Open Issue with Browser.

## Screenshot

![1](https://user-images.githubusercontent.com/7090906/131052343-9ad56dd0-5a68-4547-a424-83645fb9abb1.png)
![2](https://user-images.githubusercontent.com/7090906/131052345-6cf8a12b-0630-407c-88c7-934b1651d413.png)
![3](https://user-images.githubusercontent.com/7090906/131052348-6634b83d-bc7b-4af6-ae0b-310e2bbe04c1.png)
