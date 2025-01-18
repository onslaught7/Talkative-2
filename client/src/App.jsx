import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth' 
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { GET_USER_INFO } from './utils/constants'
import { apiClient } from './lib/api-client'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  // If the user is authenticated, render the children (protected component), otherwise, redirect to the Auth page
  return isAuthenticated ? children :  <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  // If the user is authenticated, redirect to the Chat page, otherwise, render the children (Auth page)
  return isAuthenticated ? <Navigate to="/chat" />: children;
}

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        console.log({ response });
      } catch (error) {
        console.log({ error });
      }
    }

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }

  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route 
            path = {"/auth"} 
            element = { 
              <AuthRoute>
                <Auth />
              </AuthRoute> 
            }
          />
          <Route 
            path = {"/chat"} 
            element = { 
              <PrivateRoute>
                <Chat /> 
              </PrivateRoute>
            }
          />
          <Route path = {"/profile"} 
            element = { 
              <PrivateRoute>
                <Profile /> 
              </PrivateRoute>
            }
          />
          <Route path = "*" element = { <Navigate to = "/auth"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App