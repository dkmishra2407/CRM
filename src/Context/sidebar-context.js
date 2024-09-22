import { createContext, useContext, useReducer } from "react";

// Initial state for the sidebar
const initialSidebarState = {
  isOpen: true,  // Default to open
};

// Reducer function to manage sidebar state
const sidebarReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isOpen: !state.isOpen, // Toggle the open/close state
      };
    case "OPEN_SIDEBAR":
      return {
        ...state,
        isOpen: true, // Set sidebar to open
      };
    case "CLOSE_SIDEBAR":
      return {
        ...state,
        isOpen: false, // Set sidebar to closed
      };
    default:
      return state;
  }
};

// Create the Sidebar context
const SidebarContext = createContext();

// Create a provider component for the sidebar
const SidebarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialSidebarState);

  return (
    <SidebarContext.Provider value={{ state, dispatch }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the Sidebar context
const useSidebar = () => useContext(SidebarContext);

export { useSidebar, SidebarProvider };
