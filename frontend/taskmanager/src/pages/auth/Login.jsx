import React, { useState } from 'react'
import LoginBackground from '../../components/LoginBackground'
import lg from '../../assets/Login.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { isValidEmail } from '../../utils/helper.js'
import { axiosInstance } from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPath.js'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setError("email")
      return
    }

    if (!password.trim()) {
      setError("password")
      return
    }

    setError("")
    // TODO: API call for login

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password
      })

      const {token,role,_id} = response.data
      console.log(response.data)

      if(token){
        localStorage.setItem("token",token)
        localStorage.setItem("role",role)
        localStorage.setItem("userId",_id)
        localStorage.setItem("user", JSON.stringify(response.data))
        
        if(role==="admin"){
          navigate('/admin/dashboard')
        }
        else{
          navigate('/member/dashboard')
        }
      }
      
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }
      else{
        setError("Something went wrong")
      }
    }
  }

  return (
    <>
      <LoginBackground />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
        <div className="w-[50%] h-[70%] bg-white shadow-lg flex rounded-3xl justify-between">
          <div className="login-content w-[400px] h-[320px] flex flex-col items-center mt-auto mb-auto gap-3 justify-evenly ml-6">
            <div className="flex flex-col justify-center text-center">
              <h2 className="text-black font-semibold font-heading text-3xl">Welcome Back</h2>
              <p className="text-sm font-light font-para">Enter your credentials to login</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col mt-4 w-full">
              {/* Email */}
              <div className="mb-4">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`border-1 p-1.5 w-full rounded-[6px] ${
                    error === "email" ? "border-red-500" : "border-gray-500"
                  }`}
                />
                {error === "email" && (
                  <p className="text-red-500 text-xs mt-1 ml-1">Please enter a valid email</p>
                )}
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`border-1 p-1.5 w-full rounded-[6px] pr-10 ${
                    error === "password" ? "border-red-500" : "border-gray-500"
                  }`}
                />
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
                {error === "password" && (
                  <p className="text-red-500 text-xs mt-1 ml-1">Please enter your password</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-[80px] h-[50px] bg-black text-white p-1.5 ml-auto mr-auto rounded-[12px] cursor-pointer hover:scale-110 transition-transform"
              >
                Login
              </button>

              {/* Signup Link */}
              <p className="mt-2 text-sm text-center">
                Don't have an account?{" "}
                <Link className="font-medium text-blue underline" to="/signup">
                  Signup
                </Link>
              </p>
            </form>
          </div>

          <img src={lg} alt="Login Side Visual" className="rounded-br-3xl rounded-tr-3xl" />
        </div>
      </div>
    </>
  )
}

export default Login
