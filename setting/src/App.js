import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routing from "./routing";

const queryClient = new QueryClient();

const App = ({ history, currentUser, ReRender }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routing history={history} ReRender={ReRender}/>
    </QueryClientProvider>
  );
};

export default App;
