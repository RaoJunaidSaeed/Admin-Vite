import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

import { Provider } from 'react-redux';
import store from './redux/store'; // ✅ make sure this path is correct
import { LoadingProvider } from './context/LoadingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </AuthProvider>
  </Provider>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { AuthProvider } from './context/AuthContext';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <AuthProvider>
//     <App />
//   </AuthProvider>
// );
