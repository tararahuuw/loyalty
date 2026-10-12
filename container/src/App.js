import React from "react";
import "./index.scss";
import Routing from "./routing/routes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./state/redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CheckRemoteStatusProvider } from "./provider/CheckRemoteStatus";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

const App = ({ currentUser, balance }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <CheckRemoteStatusProvider>
            <SnackbarProvider maxSnack={1}>
              <Routing history={history} balance={balance} currentUser={currentUser} />
            </SnackbarProvider>
          </CheckRemoteStatusProvider>
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
