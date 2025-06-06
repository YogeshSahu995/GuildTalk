import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import AuthLayout from './components/Layouts/AuthLayout.jsx'
import {
  Home, 
  Login, 
  Register,
  Profile,
  Post,
  PostForm,
  GroupForm,
  AllGroup,
  ProfileFollowers,
  ProfileFollowing,
  ChatWithPerson,
  ChatInGroup,
  AllChatsProfile,
  OpenGroup,
  EditProfilePage
} from "./pages"
import { AllMembers, AllRequests } from './components/components/index.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <AuthLayout children={<Login />} authentication={false} />
      },
      { 
        path: "/Edit/Profile",
        element: <AuthLayout children={<EditProfilePage />}  />
      },
      {
        path: "/",
        element: <AuthLayout children={<Home />} />
      },
      {
        path: "/profile/:username",
        element: <AuthLayout children={<Profile />} />
      },
      {
        path: "/profile/:username/followers",
        element: <AuthLayout children={<ProfileFollowers />} />
      },
      {
        path: "/profile/:username/following",
        element: <AuthLayout children={<ProfileFollowing />} />
      },
      {
        path: "/messages",
        element: <AuthLayout children={<AllChatsProfile />} />
      },
      {
        path: `/message/to/:anotherUserId`,
        element: <AuthLayout children={<ChatWithPerson />} />
      },
      {
        path: `/group/:groupId`,
        element: <AuthLayout children={<OpenGroup />} />,
        children: [
          {
            path: `/group/:groupId/members`,
            element: <AuthLayout children={<AllMembers />} />,
          },
          {
            path: `/group/:groupId/requests`,
            element: <AuthLayout children={<AllRequests />} />
          }
        ]
      },
      {
        path: `/group/message/to/:groupId`,
        element: <AuthLayout children={<ChatInGroup />} />
      },
      {
        path: "/create/post/form",
        element: <AuthLayout children={<PostForm />} />
      },
      {
        path: "/create/group/form",
        element: <AuthLayout children={<GroupForm />} />
      },
      {
        path: "/all/groups",
        element: <AuthLayout children={<AllGroup />} />
      },
      {
        path: "/post/:postId",
        element: <AuthLayout children={<Post />} />
      },
      {
        path: "/register",
        element: <AuthLayout children={<Register />} authentication={false} />
      },
    ]
  },
])


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router} >
        <App />
      </RouterProvider>
    </Provider>
)
