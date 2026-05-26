import React from 'react'
import amazon from "../../assets/amazons.png"

const Register = () => {
  return (
    <div className='min-h-screen flex flex-col items-center font-sans'>

      <div className='mt-6 mb-4'>
      <img src={amazon} alt="logo" className="w-44" />

      </div>

    <form  onSubmit={handleContinue} nonValidate>
      <label className=''>

      </label>

    </form>
      
    </div>
  )
}

export default Register