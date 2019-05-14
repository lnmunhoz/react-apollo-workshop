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
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      authorization: "Bearer TOKEN"
    }
  })
});

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.getElementById("root"));
```

## 4. Let's render our user:

```jsx
// App.js
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";

const ME = gql`
  query {
    viewer {
      login
    }
  }
`;

const Me = () => {
  const { data, loading } = useQuery(ME);

  if (loading) return <p>Loading...</p>;
  return <p>{data.viewer.login}</p>;
};

function App() {
  return (
    <Layout>
      <div className="app-starter">
        <img src={logo} className="logo" />
        <p>Hello World!</p>
        <Me />
      </div>
    </Layout>
  );
}
```

### 5. Let's setup the SearchBar component

```jsx
// App.js
import SearchBar from "./components/SearchBar";

function App() {
  const [searchText, setSearch] = React.useState("react");

  return (
    <Layout>
      <SearchBar searchText={searchText} onSearch={text => setSearch(text)} />
    </Layout>
  );
}
```

### 6. Let's write a query to search repositories:

```graphql
query {
  search(first: 10, type: REPOSITORY, query: "react") {
    nodes {
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

### 7. Passing arguments to the query:

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

### 8. Let's implement the search feature:

```jsx
// App.js
import Loader from "./components/Loader";
import Repository from "./components/Repository";
import List from "@material-ui/core/List";
import { useQuery } from "react-apollo-hooks";

const SEARCH_QUERY = gql`
  query SearchRepositories($searchText: String!) {
    search(first: 10, type: REPOSITORY, query: $searchText) {
      nodes {
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
`;

function SearchRepos({ searchText }) {
  const { data, loading } = useQuery(SEARCH_QUERY, {
    variables: {
      searchText: searchText
    }
  });

  if (loading) return <Loader />;
  return (
    <List>
      {data.search.nodes.map(node => (
        <Repository repo={node} />
      ))}
    </List>
  );
}

function App() {
  const [searchText, setSearch] = React.useState("react");

  return (
    <Layout>
      <SearchBar searchText={searchText} onSearch={text => setSearch(text)} />
      <SearchRepos searchText={searchText} />
    </Layout>
  );
}
```

### 9. Let's Implement Star and Unstar

```jsx
// components/Repository.js
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
import React from "react";

import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";

const ADD_STAR_MUTATION = gql`
  mutation addStar($repoId: ID!) {
    addStar(input: { starrableId: $repoId }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const REMOVE_STAR_MUTATION = gql`
  mutation removeStar($repoId: ID!) {
    removeStar(input: { starrableId: $repoId }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

function AddStar({ repoId, numberOfStars }) {
  const addStar = useMutation(ADD_STAR_MUTATION, {
    variables: {
      repoId
    }
  });

  return (
    <Chip
      label={"Stars " + numberOfStars}
      clickable
      color="primary"
      icon={<Stars />}
      onClick={() => {
        addStar();
      }}
    />
  );
}

function RemoveStar({ repoId, numberOfStars }) {
  const removeStar = useMutation(REMOVE_STAR_MUTATION, {
    variables: {
      repoId
    }
  });

  return (
    <Chip
      label={"Unstar " + numberOfStars}
      clickable
      icon={<Stars />}
      onClick={() => {
        removeStar();
      }}
    />
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
            <RemoveStar
              repoId={repo.id}
              numberOfStars={repo.stargazers.totalCount}
            />
          ) : (
            <AddStar
              repoId={repo.id}
              numberOfStars={repo.stargazers.totalCount}
            />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
```

### 10. Adding Optimistic Responses

```jsx
// components/Repository.js

function AddStar({ repoId, numberOfStars }) {
  const addStar = useMutation(ADD_STAR_MUTATION, {
    variables: {
      repoId
    },
    optimisticResponse: {
      addStar: {
        starrable: {
          id: repoId,
          viewerHasStarred: true,
          stargazers: {
            totalCount: numberOfStars + 1,
            __typename: "StargazerConnection"
          },
          __typename: "Repository"
        },
        __typename: "AddStarPayload"
      }
    }
  });

  return (
    <Chip
      label={"Stars " + numberOfStars}
      clickable
      color="primary"
      icon={<Stars />}
      onClick={() => {
        addStar();
      }}
    />
  );
}

function RemoveStar({ repoId, numberOfStars }) {
  const removeStar = useMutation(REMOVE_STAR_MUTATION, {
    variables: {
      repoId
    },
    optimisticResponse: {
      removeStar: {
        starrable: {
          id: repoId,
          viewerHasStarred: false,
          stargazers: {
            totalCount: numberOfStars - 1,
            __typename: "StargazerConnection"
          },
          __typename: "Repository"
        },
        __typename: "RemoveStarPayload"
      }
    }
  });

  return (
    <Chip
      label={"Unstar " + numberOfStars}
      clickable
      icon={<Stars />}
      onClick={() => {
        removeStar();
      }}
    />
  );
}
```
