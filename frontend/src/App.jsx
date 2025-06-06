import { useEffect, useState } from 'react'
import { socket } from './socket'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from "./store/userSlice"
import { getCurrentUser } from './services/user.service'
import { setupInterceptors } from './utils/apiInterceptor'
import { Layout } from './components/Layouts/Layout'
import toast, { Toaster } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { BigLoader } from './components/ui'

function App() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state?.user?.userData)
  const location = useLocation()

  useEffect(() => {
    setupInterceptors(navigate)
  }, [navigate])

  useEffect(() => {
    socket.emit("user-online", { userId: user?._id })
  }, [socket?.id, user?._id])

  useEffect(() => {
    
    const handleReceiveMessage = async ({ message, username, senderId, groupId, messageType }) => {
      if(senderId && location.pathname !== `/message/to/${senderId}` && messageType === "person" ){
        toast.success(`${username}: ${message}`)
      }
      if (groupId && location.pathname !== `/group/message/to/${groupId}` && senderId !== user?._id && messageType === "group") {
        toast.success(`${username}: ${message}`)
      }
    }
    socket.on("receiveMessage", handleReceiveMessage)

    return () => {
      socket.off("receiveMessage", handleReceiveMessage)
    }
  }, [socket, location])

  //get user details
  useEffect(() => {
      setLoading(true)
        Promise.resolve(getCurrentUser())
        .then(res => {
          if (res?.data?.data) {
            dispatch(login(res?.data?.data))
          }
        })
      .finally(() => setLoading(false)) 
  }, [])

  if (loading) return <BigLoader />

  return (
    <>
      <Toaster />
      <Layout>
        {true ? <BigLoader /> : <Outlet />}
      </Layout>
    </>
  )
}

export default App
