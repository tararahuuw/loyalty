import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotAuthenticated from "./components/emptystate/notauthenticated";

const queryClient = new QueryClient();

const App = ({
  history,
  projectId,
  setSelected,
  setRender,
  botRole,
  onCurrentBot,
  onBotRole,
  currentUsers,
  corporateCbt,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotAuthenticated />
    </QueryClientProvider>
  );
};

export default App;
