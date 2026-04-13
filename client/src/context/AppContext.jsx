import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [isLoggedin, setIsLoggedin] = useState(false)
  const [userData, setUserData] = useState(null)

  // ✅ Always send cookies
  axios.defaults.withCredentials = true

  // ✅ Check auth
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/auth/is-auth'
      )

      if (data.success) {
        setIsLoggedin(true)
      } else {
        setIsLoggedin(false)
        setUserData(null)
      }

    } catch (error) {
      setIsLoggedin(false)
      setUserData(null)
    }
  }

  // ✅ Get user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/get-user-data'
      )

      if (data.success) {
        setUserData(data.userData || data.user || data.UserData)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // ✅ Run once
  useEffect(() => {
    getAuthState()
  }, [])

  // ✅ Fetch user after login
  useEffect(() => {
    if (isLoggedin) {
      getUserData()
    }
  }, [isLoggedin])

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider