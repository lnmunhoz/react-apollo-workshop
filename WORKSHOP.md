## Server Tutorial

[Access this sandbox](https://codesandbox.io/s/m9z25zvmrp) for the server lesson.

## Client Tutorial

### 1. Generate a new access token:

```
https://github.com/settings/tokens
```

### 2. Let's explore the Github API:

```
https://developer.github.com/v4/explorer/
```

## 3. Let's setup Apollo Client!

```js
// index.js
import { ApolloProvider } from "react-apollo";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      authorization: "Bearer a1afc581c519350fbddeefaa1ae36ca64a30235c"
    }
  })
});
```

## 4. Let's render our user:

```js
function App() {
  return (
    <Layout>
      <div className="app-starter">
        <Query
          query={gql`
            query {
              viewer {
                login
                avatarUrl
              }
            }
          `}
        >
          {({ data, loading }) => {
            if (loading) return null;
            return (
              <React.Fragment>
                <img src={data.viewer.avatarUrl} className="logo" />
                <p>{data.viewer.login}</p>
              </React.Fragment>
            );
          }}
        </Query>
      </div>
    </Layout>
  );
}
```

### 5. Let's write a query to search repositories:

```graphql
query {
  search(first: 10, type: REPOSITORY, query: "react") {
    nodes {
      __typename
      ... on Repository {
        id
        name
        viewerHasStarred
        stargazers {
          totalCount
        }
        owner {
          avatarUrl
          login
        }
      }
    }
  }
}
```

### 5. Passing arguments to the query:

```graphql
query SearchRepositories($query: String!) {
  search(first: 10, type: REPOSITORY, query: $query) {
    nodes {
      __typename
      ... on Repository {
        id
        name
        viewerHasStarred
        stargazers {
          totalCount
        }
        owner {
          avatarUrl
          login
        }
      }
    }
  }
}
```

### 6. Let's implement the search feature:

```jsx
function SearchRepos({ searchText }) {
  return (
    <Query
      variables={{
        query: searchText
      }}
      query={gql`
        query SearchRepositories($query: String!) {
          search(first: 10, type: REPOSITORY, query: $query) {
            nodes {
              __typename
              ... on Repository {
                id
                name
                viewerHasStarred
                stargazers {
                  totalCount
                }
                owner {
                  avatarUrl
                  login
                }
              }
            }
          }
        }
      `}
    >
      {({ data, loading, error }) => {
        if (loading) return <Loader />;
        if (error) return <p>{error.message}</p>;

        return (
          <List>
            {data.search.nodes.map(repo => (
              <Repository repo={repo} />
            ))}
          </List>
        );
      }}
    </Query>
  );
}

function App() {
  const [searchText, setSearchText] = useState("react");

  return (
    <Layout>
      <SearchBar
        searchText={searchText}
        onSearch={text => {
          console.log(text);
          setSearchText(text);
        }}
      />

      <SearchRepos searchText={searchText} />
    </Layout>
  );
}
```

### 7. Let's Implement Star and Unstar

```jsx
import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import Stars from "@material-ui/icons/Stars";
import { gql } from "apollo-boost";
import React from "react";
import { Mutation } from "react-apollo";

function StarRepo({ repoId, totalCount }) {
  return (
    <Mutation
      variables={{
        repoId
      }}
      mutation={gql`
        mutation addStar($repoId: ID!) {
          addStar(input: { starrableId: $repoId }) {
            starrable {
              __typename
              id
              viewerHasStarred
            }
          }
        }
      `}
    >
      {addStar => (
        <Chip
          label={"Stars " + totalCount}
          color="primary"
          clickable
          icon={<Stars />}
          onClick={() =>
            addStar({
              variables: {
                repoId
              }
            })
          }
        />
      )}
    </Mutation>
  );
}

function UnstarRepo({ repoId, totalCount }) {
  return (
    <Mutation
      variables={{
        repoId
      }}
      mutation={gql`
        mutation removeStar($repoId: ID!) {
          removeStar(input: { starrableId: $repoId }) {
            starrable {
              __typename
              id
              viewerHasStarred
            }
          }
        }
      `}
    >
      {removeStar => (
        <Chip
          label={"Unstar " + totalCount}
          clickable
          icon={<Stars />}
          onClick={() =>
            removeStar({
              variables: {
                repoId
              }
            })
          }
        />
      )}
    </Mutation>
  );
}

export default function Repository({ repo }) {
  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={repo.owner.login} src={repo.owner.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={repo.name}
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {repo.owner.login}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          {repo.viewerHasStarred ? (
            <UnstarRepo
              repoId={repo.id}
              totalCount={repo.stargazers.totalCount}
            />
          ) : (
            <StarRepo
              repoId={repo.id}
              totalCount={repo.stargazers.totalCount}
            />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
```

### 8. Adding Optimistic Responses

```jsx
import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import Stars from "@material-ui/icons/Stars";
import { gql } from "apollo-boost";
import React from "react";
import { Mutation } from "react-apollo";

function StarRepo({ repoId, totalCount }) {
  return (
    <Mutation
      variables={{
        repoId
      }}
      optimisticResponse={{
        addStar: {
          starrable: {
            __typename: "Repository",
            id: repoId,
            viewerHasStarred: true,
            stargazers: {
              __typename: "StargazerConnection",
              totalCount: totalCount + 1
            }
          },
          __typename: "AddStarPayload"
        }
      }}
      mutation={gql`
        mutation addStar($repoId: ID!) {
          addStar(input: { starrableId: $repoId }) {
            starrable {
              __typename
              id
              viewerHasStarred
              stargazers {
                totalCount
              }
            }
          }
        }
      `}
    >
      {addStar => (
        <Chip
          label={"Stars " + totalCount}
          color="primary"
          clickable
          icon={<Stars />}
          onClick={() =>
            addStar({
              variables: {
                repoId
              }
            })
          }
        />
      )}
    </Mutation>
  );
}

function UnstarRepo({ repoId, totalCount }) {
  return (
    <Mutation
      variables={{
        repoId
      }}
      optimisticResponse={{
        removeStar: {
          starrable: {
            __typename: "Repository",
            id: repoId,
            viewerHasStarred: false,
            stargazers: {
              __typename: "StargazerConnection",
              totalCount: totalCount - 1
            }
          },
          __typename: "RemoveStarPayload"
        }
      }}
      mutation={gql`
        mutation removeStar($repoId: ID!) {
          removeStar(input: { starrableId: $repoId }) {
            starrable {
              __typename
              id
              viewerHasStarred
              stargazers {
                totalCount
              }
            }
          }
        }
      `}
    >
      {removeStar => (
        <Chip
          label={"Unstar " + totalCount}
          clickable
          icon={<Stars />}
          onClick={() =>
            removeStar({
              variables: {
                repoId
              }
            })
          }
        />
      )}
    </Mutation>
  );
}

export default function Repository({ repo }) {
  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={repo.owner.login} src={repo.owner.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={repo.name}
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {repo.owner.login}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          {repo.viewerHasStarred ? (
            <UnstarRepo
              repoId={repo.id}
              totalCount={repo.stargazers.totalCount}
            />
          ) : (
            <StarRepo
              repoId={repo.id}
              totalCount={repo.stargazers.totalCount}
            />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
```

### 9 Hooks?

If we have time :)
