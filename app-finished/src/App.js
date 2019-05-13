import { List } from "@material-ui/core";
import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import Repository from "./components/Repository";
import SearchBar from "./components/SearchBar";
import { SEARCH_QUERY } from "./graphql";

const SearchRepos = ({ searchText }) => {
  const { data, loading, error } = useQuery(SEARCH_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      query: searchText
    }
  });

  if (loading) return <Loader />;
  if (error) return <p>{error.message}</p>;
  const nodes = data.search.nodes;

  return (
    <List style={{ padding: 20 }}>
      {nodes.length > 0 ? (
        nodes.map(repo => <Repository key={repo.id} repo={repo} />)
      ) : (
        <p>No results</p>
      )}
    </List>
  );
};

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
