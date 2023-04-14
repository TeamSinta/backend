import axios  from "axios";


const instance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
  });

const getRefreshToken = () => {

  };

instance.interceptors.response.use(function(response){
  return response;
}, function (error){
  const originalRequest = error.config;
  if(error.response.status === 401 && !originalRequest._retry){
    originalRequest._retry = true;
    const refreshToken = getRefreshToken(); // get refresh token from a cookie
    return instance.post('/auth/refresh', {refreshToken}).then((response) => {
      if(response.status === 200){
        const accessToken = response.data.accessToken
        originalRequest.headers.Authorization = `JWT ${accessToken}`
        return instance(originalRequest)
      }
    } )
  }
return Promise.reject(error)

});

const getAccessToken = () => {

};


instance.interceptors.request.use(function(config){
  const accessToken = getAccessToken();// get access token from a variable or cookie
  config.headers.Authorization = `JWT ${accessToken}`
  return config;
}, function (error){

return Promise.reject(error)

});

export default instance;
