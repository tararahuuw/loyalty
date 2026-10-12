// redux.js
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";

// Action Types
const actionTypes = {
  SIDEBAR_STATUS: "SIDEBAR_STATUS",
  RESET_STORE: "RESET_STORE",
  USER_INFO: "USER_INFO",
  TIMER_BANNED: "TIMER_BANNED",
  TOTAL_BALANCE: "TOTAL_BALANCE",
  USER_INPUT: "USER_INPUT",
  RESET_USER_INPUT: "RESET_USER_INPUT",
  SET_CATEGORY: "SET_CATEGORY",
  SET_CAMPAIGN_ID: "SET_CAMPAIGN_ID",
};

// Reducer
const globalState = {
  isExpandSidebar: true,
  userInfo: {
    userId: "",
    userName: "",
    roleId: "",
    roleName: "",
    clientId: "",
    divisionId: "",
    clientName: "",
    divisionName: "",
    isInternal: "",
    phoneNumber: "",
    email: "",
  },
  timerBanned: null,
  totalBalance: 0,
  userInput: null,
  category: null,
  campaignId: "",
};

const rootReducer = (state = globalState, action) => {
  switch (action.type) {
    case actionTypes.SIDEBAR_STATUS:
      return {
        ...state,
        isExpandSidebar: !state.isExpandSidebar,
      };
    case actionTypes.USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case actionTypes.TIMER_BANNED:
      return {
        ...state,
        timerBanned: action.payload,
      };
    case actionTypes.TOTAL_BALANCE:
      return {
        ...state,
        totalBalance: action.payload,
      };
    case actionTypes.USER_INPUT:
      return {
        ...state,
        userInput: action.payload,
      };
    case actionTypes.RESET_USER_INPUT:
      return {
        ...state,
        userInput: null,
      };
    case actionTypes.SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    case actionTypes.SET_CAMPAIGN_ID:
      return {
        ...state,
        campaignId: action.payload,
      };
    case actionTypes.RESET_STORE:
      return globalState;
    default:
      return state;
  }
};

// Redux Persist configuration
const persistConfig = {
  key: "prezent",
  storage: localForage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

// Dispatch
export const mapStateToProps = (state) => {
  return state;
};

export const mapDispatchToProps = (dispatch) => ({
  handleSidebarStatus: (isExpandSidebar) => {
    dispatch({
      type: actionTypes.SIDEBAR_STATUS,
      payload: !isExpandSidebar,
    });
  },
  handleSetUserInfo: (userInfo) => {
    dispatch({
      type: actionTypes.USER_INFO,
      payload: userInfo,
    });
  },
  handleSetTimerBanned: (timerBanned) => {
    dispatch({
      type: actionTypes.TIMER_BANNED,
      payload: timerBanned instanceof Date ? timerBanned.toISOString() : timerBanned,
    });
  },
  handleSetTotalBalance: (totalBalance) => {
    dispatch({
      type: actionTypes.TOTAL_BALANCE,
      payload: totalBalance,
    });
  },
  handleSetUserInput: (userInput) => {
    dispatch({
      type: actionTypes.USER_INPUT,
      payload: userInput,
    });
  },
  handleResetUserInput: () => {
    dispatch({
      type: actionTypes.RESET_USER_INPUT,
    });
  },
  handleSetCategory: (category) => {
    dispatch({
      type: actionTypes.SET_CATEGORY,
      payload: category,
    });
  },
  handleSetCampaignId: (campaignId) => {
    dispatch({
      type: actionTypes.SET_CAMPAIGN_ID,
      payload: campaignId,
    });
  },
  handleResetStore: () => {
    dispatch({
      type: actionTypes.RESET_STORE,
    });
  },
});
