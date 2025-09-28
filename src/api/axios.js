// 1. // src/api/axios.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: `http://${window.location.hostname}:5000/api`,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// export default API;

// 2. src/api/axios.js
import axios from 'axios';

let baseURL;

// Use localhost for PC dev
if (window.location.hostname === 'localhost') {
  baseURL = 'http://localhost:5000/api';
  // console.log(baseURL);
} else {
  // Use the IP address for mobile or other devices on LAN
  baseURL = `http://192.168.100.59:5000/api`;
}

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default API;

// 3.
// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://rentofix-backend-live-api.onrender.com/api',
//   withCredentials: true,
// });

// export default API;
