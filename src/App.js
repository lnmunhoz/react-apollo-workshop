import React from "react";
import Layout from "./Layout";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  List,
  ListItemText
} from "@material-ui/core";

const MY_QUERY = gql`
  query {
    viewer {
      login
    }
  }
`;

const GET_REPOSITORY = gql`
  query {
    repository(owner: "lnmunhoz", name: "react-apollo-workshop") {
      id
      name
      issues(first: 10) {
        nodes {
          id
          title
          bodyText
          closed
          author {
            login
            avatarUrl
          }
        }
      }
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

const Repository = () => (
  <Query query={GET_REPOSITORY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;

      const repository = data.repository;
      const issues = repository.issues.nodes;

      return (
        <List>
          {issues.map(issue => (
            <ListItem alignItems="flex-start" key={issue.id}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={issue.author.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={issue.title}
                secondary={
                  <React.Fragment>
                    <Typography component="span" color="textPrimary">
                      {issue.bodyText}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      );
    }}
  </Query>
);

function App() {
  return (
    <Layout>
      <Repository />
    </Layout>
  );
}

export default App;
