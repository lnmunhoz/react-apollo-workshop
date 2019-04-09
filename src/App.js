import React, { useCallback, useState } from "react";
import Layout from "./Layout";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  List,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Paper
} from "@material-ui/core";
import SearchBar from "./ui/SearchBar";
import Repository from "./ui/Repository";
import Loading from "./ui/Loading";

const MY_QUERY = gql`
  query {
    viewer {
      login
    }
  }
`;

const MyUsername = () => (
  <Query query={MY_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      return <p>{data.viewer.login}</p>;
    }}
  </Query>
);

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
      if (loading) return <Loading />;
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

function App() {
  const [searchText, setSearchText] = useState("react");
  const [isSearching, setIsSearching] = useState(false);

  return (
    <Layout>
      <SearchBar
        searchText={searchText}
        onSearch={text => setSearchText(text)}
        onSearchFocus={() => setIsSearching(true)}
        onSearchBlur={() => setIsSearching(false)}
      />

      <SearchRepos searchText={searchText} />
    </Layout>
  );
}

export default App;
