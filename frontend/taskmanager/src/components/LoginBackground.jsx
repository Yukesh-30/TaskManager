import React from 'react'
import bg from '../assets/Loginbg.jpg'

function LoginBackground() {
  return (
    <div className='w-full h-full overflow-hidden bg-repeat -z-10'>
      <img src={bg} alt="backgroundImage" className='w-full h-[100vh] object-cover object-center'/>
    </div>
  )
}

export default LoginBackground