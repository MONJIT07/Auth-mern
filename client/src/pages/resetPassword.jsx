import React, { useState, useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext)

  axios.defaults.withCredentials = true
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)

  const inputsRef = useRef([])

  const handleChange = (e, index) => {
    if (isNaN(e.target.value)) return

    const newOtp = [...otp]
    newOtp[index] = e.target.value
    setOtp(newOtp)

    if (e.target.value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()

    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6)

    if (!/^\d+$/.test(pasteData)) return

    const newOtp = pasteData.split("")
    setOtp(newOtp)

    newOtp.forEach((digit, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = digit
      }
    })

    inputsRef.current[newOtp.length - 1]?.focus()
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      setIsEmailSent(true)
      data.success ? toast.success(data.message) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message || error.response?.data?.message)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    const otpArray = inputsRef.current.map(e => e.value)
    setOtp(otpArray.join(""))
    setIsOtpSubmited(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* EMAIL FORM */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            Reset Password
          </h1>

          <p className='text-center mb-6 text-indigo-300'>
            Enter your registered email address
          </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />

            {/* ✅ FIX: text color changed to white */}
            <input
              type="email"
              placeholder='Email id'
              className='bg-transparent outline-none text-white w-full placeholder-gray-400'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
        </form>
      }

      {/* OTP FORM */}
      {isOtpSubmited === false && isEmailSent &&
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm mt-6'>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(e) => (inputsRef.current[index] = e)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      }

      {/* NEW PASSWORD */}
      {isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />

            <input
              type="password"
              placeholder='New Password'
              className='bg-transparent outline-none text-white w-full placeholder-gray-400'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
        </form>
      }

    </div>
  )
}

export default ResetPassword