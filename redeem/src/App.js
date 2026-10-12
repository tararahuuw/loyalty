import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotAuthenticated from "./components/emptystate/notauthenticated";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotAuthenticated />
    </QueryClientProvider>
  );
};

export default App;
