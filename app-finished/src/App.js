import { List } from "@material-ui/core";
import React, { useState } from "react";
import { Query } from "react-apollo";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import Repository from "./components/Repository";
import SearchBar from "./components/SearchBar";
import { SEARCH_QUERY } from "./graphql";

const SearchRepos = ({ searchText }) => (
  <Query
    variables={{
      query: searchText
    }}
    query={SEARCH_QUERY}
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
