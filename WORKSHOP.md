## Step by Step

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

### 5. How to add variables

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
