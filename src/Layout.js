import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";

class App extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        {children}
      </React.Fragment>
    );
  }
}

export default App;
