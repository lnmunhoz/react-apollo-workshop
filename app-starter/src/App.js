import React from "react";
import Layout from "./components/Layout";
import logo from "./logo.svg";

function App() {
  return (
    <Layout>
      <div className="app-starter">
        <img src={logo} className="logo" />
        <p>Hello World!</p>
      </div>
    </Layout>
  );
}

export default App;
