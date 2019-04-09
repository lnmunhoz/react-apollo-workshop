import { List } from "@material-ui/core";
import { gql } from "apollo-boost";
import React, { useState } from "react";
import { Query } from "react-apollo";
import Loader from "./components/Loader";
import Repository from "./components/Repository";
import SearchBar from "./components/SearchBar";
import Layout from "./components/Layout";

export const RepositoryFields = gql`
  fragment RepositoryFields on Repository {
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
`;

const SearchRepos = ({ searchText }) => (
  <Query
    variables={{
      query: searchText
    }}
    query={gql`
      query SearchRepos($query: String!) {
        search(first: 10, type: REPOSITORY, query: $query) {
          nodes {
            __typename
            ... on Repository {
              ...RepositoryFields
            }
          }
        }
      }
      ${RepositoryFields}
    `}
  >
    {({ data, loading, error }) => {
      if (loading) return <Loader />;
      if (error) return <p>{error.message}</p>;

      return (
        <List style={{ padding: 20 }}>
          {data.search.nodes.map(repo => (
            <Repository key={repo.id} repo={repo} />
          ))}
        </List>
      );
    }}
  </Query>
);

function App() {
  const [searchText, setSearchText] = useState("react");

  return (
    <Layout>
      <SearchBar
        searchText={searchText}
        onSearch={text => setSearchText(text)}
      />

      <SearchRepos searchText={searchText} />
    </Layout>
  );
}

export default App;
