import React, { createContext, useContext } from "react";

// Create a simplified context without authentication
type AuthContextType = {
  // Provide a mock user with basic info for components that need it
  user: {
    displayName: string;
    email: string;
  } | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: {
    displayName: "User",
    email: "user@example.com",
  },
  isLoading: false,
});

// Create provider with mock user data
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provide a default mock user
  const mockUser = {
    displayName: "User",
    email: "user@example.com",
  };

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create hook
export const useAuth = () => useContext(AuthContext);