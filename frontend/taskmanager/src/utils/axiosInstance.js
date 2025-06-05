import axios from 'axios'
import { BASE_URL } from './apiPath.js'

const axiosInstance = axios.create({
    baseURL : BASE_URL,
    timeout : 10000,
    headers :{
        "Content-Type" : "application/json",
        Accept : "application/json"
    }

})

axiosInstance.interceptors.request.use((config)=>{
    const acessToken = localStorage.getItem("token")
    if(acessToken){
        config.headers.Authorization =`Bearer ${acessToken}`
    }
    return config;

},(error)=>{
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        window.location.href = "/login"
      }
      if (error.response.status === 500) {
        console.error("Server Error")
      }
    }

    // 👇 This was missing — without it, error never reaches your catch block
    return Promise.reject(error)
  }
)

export {axiosInstance}