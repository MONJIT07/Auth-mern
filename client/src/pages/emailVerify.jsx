import React, { useContext, useRef, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  const { backendUrl, getUserData, userData } = useContext(AppContext)
  const navigate = useNavigate()

  const [otp, setOtp] = useState(new Array(6).fill(""))
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(30)
  const [shake, setShake] = useState(false)

  const inputsRef = useRef([])

  // ✅ REDIRECT IF ALREADY VERIFIED
  useEffect(() => {
    if (userData?.isAccountVerified) {
      navigate('/')
    }
  }, [userData])

  // TIMER
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // INPUT CHANGE
  const handleChange = (e, index) => {
    if (isNaN(e.target.value)) return

    const newOtp = [...otp]
    newOtp[index] = e.target.value
    setOtp(newOtp)

    if (e.target.value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  // BACKSPACE
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  // PASTE OTP
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

    // AUTO SUBMIT
    if (pasteData.length === 6) {
      verifyOtp(newOtp.join(""))
    }
  }

  // VERIFY OTP
  const verifyOtp = async (finalOtp) => {
    try {
      setLoading(true)

      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-email',
        { otp: finalOtp }
      )

      if (data.success) {
        toast.success("Email verified successfully")
        await getUserData()
        navigate('/')
      } else {
        triggerError()
        toast.error(data.message)
      }

    } catch (error) {
      triggerError()
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault()
    const finalOtp = otp.join("")
    if (finalOtp.length < 6) return toast.error("Enter complete OTP")
    verifyOtp(finalOtp)
  }

  // RESEND OTP
  const resendOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-verify-otp'
      )

      if (data.success) {
        toast.success("OTP resent")
        setTimer(30)
      }
    } catch (error) {
      toast.error("Failed to resend OTP")
    }
  }

  // ERROR SHAKE
  const triggerError = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">

      <form
        onSubmit={handleSubmit}
        className={`bg-slate-900 p-8 rounded-xl shadow-lg text-center ${shake ? 'animate-shake' : ''}`}
      >

        <h1 className="text-white text-2xl font-semibold mb-2">
          Email Verify OTP
        </h1>

        <p className="text-indigo-300 text-sm mb-6">
          Enter the 6-digit code sent to your email id.
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-12 h-12 text-center text-xl rounded-md bg-slate-800 text-white border border-gray-600 focus:border-indigo-400 outline-none"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          disabled={loading}
          className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* RESEND */}
        <p className="text-gray-400 text-sm mt-4">
          {timer > 0 ? (
            `Resend OTP in ${timer}s`
          ) : (
            <span
              onClick={resendOtp}
              className="text-indigo-400 cursor-pointer"
            >
              Resend OTP
            </span>
          )}
        </p>

      </form>

      {/* SHAKE ANIMATION */}
      <style>
        {`
          .animate-shake {
            animation: shake 0.3s;
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

    </div>
  )
}

export default EmailVerify