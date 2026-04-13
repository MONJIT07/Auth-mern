import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const { userData, backendUrl, setUserData, setIsLoggedin, getUserData } =
    useContext(AppContext)

  // SEND OTP
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-verify-otp'
      )

      if (data.success) {
        toast.success("Verification OTP sent")
        navigate('/email-verify')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // LOGOUT
  const logout = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/logout',
        {},
        { withCredentials: true }
      )

      if (data.success) {
        setIsLoggedin(false)
        setUserData(null)
        navigate('/')
      }

    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 absolute top-0">

      <img src={assets.logo} alt="" className="w-28 sm:w-32" />

      {userData ? (
        <div className="relative group">

          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer">
            {userData.name[0]}
          </div>

          <div className="absolute hidden group-hover:block top-10 right-0 z-10 text-black rounded pt-2">
            <ul className="list-none m-0 p-2 bg-gray-200 text-sm">

              {/* ✅ FIXED CONDITION */}
              {!userData?.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-300 cursor-pointer"
                >
                  Verify email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-300 cursor-pointer"
              >
                Logout
              </li>

            </ul>
          </div>

        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}

    </div>
  )
}

export default Navbar