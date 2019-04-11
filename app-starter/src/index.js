import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Github API: "https://api.github.com/graphql"
import { ApolloProvider } from "react-apollo";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";

const client = new ApolloClient({
  cache: new InMemoryCache({}),
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      authorization: "Bearer a4a6b8079fb9ddc88a3bc1750d8da2e35a9c55ea"
    }
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
