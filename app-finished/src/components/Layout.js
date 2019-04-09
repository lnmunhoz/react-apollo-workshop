import CssBaseline from "@material-ui/core/CssBaseline";
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
