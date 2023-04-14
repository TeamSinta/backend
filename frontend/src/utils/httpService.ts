import axios  from "axios";


const instance = axios.create({
  baseURL: 'http://api.example.com/',
  headers: {
    'Content-Type': 'application/json'
  }
  });

instance.interceptors.response.use(function(config){

  return config;
}, function (error){

return Promise.reject(error)

});


instance.interceptors.request.use(function(config){

  return config;
}, function (error){

return Promise.reject(error)

});
