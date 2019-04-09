import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import React from "react";

export default function Repository({ id, owner, name, stargazers }) {
  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={owner.login} src={owner.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {owner.login}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <Chip label={stargazers.totalCount + " Stars"} />
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
