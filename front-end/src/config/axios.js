import axios from 'axios';
import auth from './../services/auth.service.js';

const api = axios.create();

api.interceptors.request.use(
  function (config) {
    config.headers['Accept'] = 'application/json';
    const token = auth.isLoggedIn() && auth.getToken();

    if(token){
      config.headers['Authorization'] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error)
  }
)

export { api }
