import React, { useState } from 'react'
import amazon from "../../assets/amazons.png"
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step , setStep] = useState(1)
  const [email,setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [emailError , setEmailError] = useState('');
  const [passwordError ,setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e) =>{
    e.preventDefault()
    if(!email.trim()){
      setEmailError("Enter your email or mobile number")
      return

    }
    setEmailError('')
    setStep(2)
  }

  /* ── Submit sign in ── */
  const handleSignIn =(e)=>{
    e.preventDefault()
    if(!password.trim()){
      setPasswordError("Enter your password")
      return
    }
    setPasswordError('')
    navigate("/")
  }
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