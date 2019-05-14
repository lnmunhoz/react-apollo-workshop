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
import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";

const ADD_STAR_MUTATION = gql`
  mutation addStar($repoId: ID!) {
    addStar(input: { starrableId: $repoId }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const REMOVE_STAR_MUTATION = gql`
  mutation removeStar($repoId: ID!) {
    removeStar(input: { starrableId: $repoId }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

function AddStar({ repoId, numberOfStars }) {
  const addStar = useMutation(ADD_STAR_MUTATION, {
    variables: {
      repoId
    },
    optimisticResponse: {
      addStar: {
        starrable: {
          id: repoId,
          viewerHasStarred: true,
          stargazers: {
            totalCount: numberOfStars + 1,
            __typename: "StargazerConnection"
          },
          __typename: "Repository"
        },
        __typename: "AddStarPayload"
      }
    }
  });

  return (
    <Chip
      label={"Stars " + numberOfStars}
      clickable
      color="primary"
      icon={<Stars />}
      onClick={() => {
        addStar();
      }}
    />
  );
}

function RemoveStar({ repoId, numberOfStars }) {
  const removeStar = useMutation(REMOVE_STAR_MUTATION, {
    variables: {
      repoId
    },
    optimisticResponse: {
      removeStar: {
        starrable: {
          id: repoId,
          viewerHasStarred: false,
          stargazers: {
            totalCount: numberOfStars - 1,
            __typename: "StargazerConnection"
          },
          __typename: "Repository"
        },
        __typename: "RemoveStarPayload"
      }
    }
  });

  return (
    <Chip
      label={"Unstar " + numberOfStars}
      clickable
      icon={<Stars />}
      onClick={() => {
        removeStar();
      }}
    />
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
            <RemoveStar
              repoId={repo.id}
              numberOfStars={repo.stargazers.totalCount}
            />
          ) : (
            <AddStar
              repoId={repo.id}
              numberOfStars={repo.stargazers.totalCount}
            />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
