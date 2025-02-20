import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

// Define the shape of the context value
interface LoadingContextValue {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>; // Correct type for setIsLoading
}

// Create the context with a default value
const LoadingContext = createContext<LoadingContextValue>({
  isLoading: false,
  setIsLoading: () => { }, // Default no-op function for TypeScript
});

// Create the provider to wrap your application
const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export default LoadingProvider;
