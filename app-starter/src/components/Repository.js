import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import Stars from "@material-ui/icons/Stars";
import { gql } from "apollo-boost";
import React from "react";
import { Mutation } from "react-apollo";

const STAR_FIELDS_FRAGMENT = gql`
  fragment StarFields on Repository {
    __typename
    id
    viewerHasStarred
    stargazers {
      totalCount
    }
  }
`;

function StarRepo({ repoId, totalCount }) {
  return (
    <Mutation
      variables={{
        repoId
      }}
      optimisticResponse={{
        addStar: {
          starrable: {
            __typename: "Repository",
            id: repoId,
            viewerHasStarred: true,
            stargazers: {
              __typename: "StargazerConnection",
              totalCount: totalCount + 1
            }
          },
          __typename: "AddStarPayload"
        }
      }}
      mutation={gql`
        mutation addStar($repoId: ID!) {
          addStar(input: { starrableId: $repoId }) {
            starrable {
              ...StarFields
            }
          }
        }
        ${STAR_FIELDS_FRAGMENT}
      `}
    >
      {addStar => (
        <Chip
          label={"Stars " + totalCount}
          color="primary"
          clickable
          icon={<Stars />}
          onClick={() =>
            addStar({
              variables: {
                repoId
              }
            })
          }
        />
      )}
    </Mutation>
  );
}

function UnstarRepo({ repoId, totalCount }) {
  return (
    <Mutation
      variables={{
        repoId
      }}
      optimisticResponse={{
        removeStar: {
          starrable: {
            __typename: "Repository",
            id: repoId,
            viewerHasStarred: false,
            stargazers: {
              __typename: "StargazerConnection",
              totalCount: totalCount - 1
            }
          },
          __typename: "RemoveStarPayload"
        }
      }}
      mutation={gql`
        mutation removeStar($repoId: ID!) {
          removeStar(input: { starrableId: $repoId }) {
            starrable {
              ...StarFields
            }
          }
        }
        ${STAR_FIELDS_FRAGMENT}
      `}
    >
      {removeStar => (
        <Chip
          label={"Unstar " + totalCount}
          clickable
          icon={<Stars />}
          onClick={() =>
            removeStar({
              variables: {
                repoId
              }
            })
          }
        />
      )}
    </Mutation>
  );
}

export default function Repository({ repo }) {
  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={repo.owner.login} src={repo.owner.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={repo.name}
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {repo.owner.login}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          {repo.viewerHasStarred ? (
            <UnstarRepo
              repoId={repo.id}
              totalCount={repo.stargazers.totalCount}
            />
          ) : (
            <StarRepo
              repoId={repo.id}
              totalCount={repo.stargazers.totalCount}
            />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
