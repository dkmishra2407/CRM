import { createContext, useContext, useReducer } from "react";

// Initial state with the accessible pages
const initialValue = {
  pageAccess: [],  // Array of page objects { pageName: string }
};

// Reducer to handle setting the page access dynamically
const pageReducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGES":
      return { ...state, pageAccess: action.payload };
    default:
      return state;
  }
};

// Create the context
const PageContext = createContext();

// PageProvider to provide state and dispatch to child components
const PageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pageReducer, initialValue);

  return (
    <PageContext.Provider value={{ state, dispatch }}>
      {children}
    </PageContext.Provider>
  );
};

// Hook for easier usage of the PageContext
const usePage = () => useContext(PageContext);

export { usePage, PageProvider };
