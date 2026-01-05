import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

// Initial demo user data
const initialUserData = {
  firstName: 'John',
  lastName: 'Doe',
  middleName: '',
  email: 'john.doe@example.com',
  phone: '+63 912 345 6789',
  birthDate: '1990-01-01',
  gender: 'Male',
  streetBarangay: 'Sample Street',
  townCity: 'Sample City',
  province: 'Sample Province',
  username: 'johndoe',
  role: 'Member'
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialUserData);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (newData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newData
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 