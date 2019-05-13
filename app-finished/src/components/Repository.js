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
import { useMutation } from "react-apollo-hooks";
import { ADD_STAR_MUTATION, REMOVE_STAR_MUTATION } from "../graphql";

export default function Repository({ repo }) {
  const addStar = useMutation(ADD_STAR_MUTATION, {
    variables: {
      repoId: repo.id
    },
    optimisticResponse: {
      addStar: {
        __typename: "AddStarPayload",
        starrable: {
          __typename: "Repository",
          ...repo,
          viewerHasStarred: true,
          stargazers: {
            __typename: "StargazerConnection",
            totalCount: repo.stargazers.totalCount + 1
          }
        }
      }
    }
  });

  const removeStar = useMutation(REMOVE_STAR_MUTATION, {
    variables: {
      repoId: repo.id
    },
    optimisticResponse: {
      removeStar: {
        __typename: "RemoveStarPayload",
        starrable: {
          ...repo,
          viewerHasStarred: false,
          stargazers: {
            __typename: "StargazerConnection",
            totalCount: repo.stargazers.totalCount - 1
          },
          __typename: "Repository"
        }
      }
    }
  });

  const starredProps = {
    label: repo.viewerHasStarred
      ? `Unstar ${repo.stargazers.totalCount}`
      : `Star ${repo.stargazers.totalCount}`,
    onClick: repo.viewerHasStarred ? removeStar : addStar,
    color: repo.viewerHasStarred ? "default" : "primary"
  };

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
          <Chip clickable icon={<Stars />} {...starredProps} />
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
