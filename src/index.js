import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Category from "./Category";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Category />
  </React.StrictMode>
);

export default client;
