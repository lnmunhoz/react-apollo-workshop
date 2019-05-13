import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      authorization: "Bearer 188834c418a209de7311721712316e475e2218a4"
    }
  })
});

ReactDOM.render(
  <ApolloHooksProvider client={client}>
    <App />
  </ApolloHooksProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
