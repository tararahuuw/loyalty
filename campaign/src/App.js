import React from "react";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routing from "./routing";

const queryClient = new QueryClient();

const App = ({}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routing />
    </QueryClientProvider>
  );
};

export default App;
