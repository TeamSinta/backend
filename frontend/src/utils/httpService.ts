import axios  from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
  });

const getRefreshToken = ''

const getAccessToken = () => {
  const name = "access_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;

};


instance.interceptors.response.use(function(response){
  return response;
  }, function (error){
  const originalRequest = error.config;
  if(error.response.status === 401 && !originalRequest._retry){
    originalRequest._retry = true;
    debugger
    const refreshToken = getRefreshToken; // get refresh token from a cookie
    return instance.post('/auth/refresh', {refreshToken}).then((response) => {
      if(response.status === 200){
        const accessToken = response.data.accessToken
        // setAccessToken(accessToken); <- Optional? // store new access token in a variable
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return instance(originalRequest)
      }
    } )
  }
return Promise.reject(error)

});



instance.interceptors.request.use(function(config){
  const accessToken = getAccessToken();// get access token from a variable or cookie
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }  return config;
}, function (error){

return Promise.reject(error)

});

export default instance;
