import { CircularProgress } from "@material-ui/core";
import React from "react";

export default function Loader() {
  return (
    <CircularProgress
      style={{ margin: "0 auto", display: "block", marginTop: 10 }}
    />
  );
}
