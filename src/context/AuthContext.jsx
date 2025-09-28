// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// // src/context/AuthContext.js
// import { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true); // NEW: loading state

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');

//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//       setIsAuthenticated(true);
//     } else {
//       setUser(null);
//       setIsAuthenticated(false);
//     }

//     setLoading(false); // <-- done restoring auth state
//   }, []);

//   const login = (userData, token) => {
//     setUser(userData);
//     setIsAuthenticated(true);
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('token', token);
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // src/context/AuthContext.js
// import { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');

//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = (userData, token) => {
//     setUser(userData);
//     setIsAuthenticated(true);
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('token', token);
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // // src/context/AuthContext.js
// // import { createContext, useState, useEffect } from 'react';

// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const stored = localStorage.getItem('user');
// //     if (stored) {
// //       setUser(JSON.parse(stored));
// //     }
// //   }, []);

// //   const login = (userData) => {
// //     setUser(userData);
// //     localStorage.setItem('user', JSON.stringify(userData));
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem('user');
// //   };

// //   return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
// // };
