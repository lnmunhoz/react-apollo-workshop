import React, { useState } from "react";
import Layout from "./components/Layout";
import logo from "./logo.svg";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import SearchBar from "./components/SearchBar";
import Loader from "./components/Loader";
import Repository from "./components/Repository";
import List from "@material-ui/core/List";

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

export default App;
