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

export default function Repository({ repo }) {
  const starText = repo.viewerHasStarred ? "Unstar" : "Star";

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
          <Chip
            label={`${starText}  ${repo.stargazers.totalCount}`}
            clickable
            icon={<Stars />}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
