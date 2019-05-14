import React from "react";
import Layout from "./components/Layout";
import SearchBar from "./components/SearchBar";
import { gql } from "apollo-boost";
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

export default App;
