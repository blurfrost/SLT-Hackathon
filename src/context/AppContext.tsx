import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useReducer } from "react";

import { AppAction, AppContextValue, AppState } from "@/types";

const initialState: AppState = {
  announcements: [],
  currentUser: null,
  selectedAnnouncementId: null,
  isLoading: false
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload
      };
    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload
      };
    case "SET_ANNOUNCEMENTS":
      return {
        ...state,
        announcements: action.payload
      };
    case "SET_SELECTED_ANNOUNCEMENT":
      return {
        ...state,
        selectedAnnouncementId: action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setCurrentUser = useCallback(
    (user: AppState["currentUser"]) =>
      dispatch({
        type: "SET_CURRENT_USER",
        payload: user
      }),
    []
  );

  const setAnnouncements = useCallback(
    (announcements: AppState["announcements"]) =>
      dispatch({
        type: "SET_ANNOUNCEMENTS",
        payload: announcements
      }),
    []
  );

  const setLoading = useCallback(
    (isLoading: boolean) =>
      dispatch({
        type: "SET_LOADING",
        payload: isLoading
      }),
    []
  );

  const setSelectedAnnouncement = useCallback(
    (announcementId: string | null) =>
      dispatch({
        type: "SET_SELECTED_ANNOUNCEMENT",
        payload: announcementId
      }),
    []
  );

  const value: AppContextValue = useMemo(
    () => ({
      state,
      dispatch,
      setCurrentUser,
      setAnnouncements,
      setLoading,
      setSelectedAnnouncement
    }),
    [state, setCurrentUser, setAnnouncements, setLoading, setSelectedAnnouncement]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
