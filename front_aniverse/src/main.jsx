import React, { Profiler } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Register } from './pages/Register/Register.jsx'
import { Login } from './pages/Login/Login.jsx'
import { VerifyCode } from './pages/VerifyCode/VerifyCode.jsx'
import { ForgotPassword } from './pages/ForgotPassword/FotgotPassword.jsx'
import { ChangePassword } from './pages/ChangePassword/ChangePassword.jsx'

import { Profile } from './pages/Profile/Profile.jsx'
import { Home } from './pages/Home/Home.jsx'
import Characters from './pages/Characters/Characters.jsx'
import Movies from './pages/Movies/Movies.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import { AuthContextProvider } from './context/authContext.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/'>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Register />} />
            <Route path='/verifyCode' element={<VerifyCode />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/changepassword' element={<ChangePassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/home' element={<Home />} />
            <Route path='/movie' element={<Movies />} />
            <Route path='/*' element={<NotFound />} />
          </Route> 
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
