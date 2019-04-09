import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// 1. Import apollo-boost and react-apollo
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";

// 2. Create a new apollo client
const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: object => object.id
  }),
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      authorization: "Bearer 54d31fa09b796e1328ed1c55f492e5a9a8c93cb1"
    }
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
