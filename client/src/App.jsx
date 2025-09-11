import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import ForgotPassword from './pages/forgotPassword/ForgotPassword.jsx';
import ResetPassword from './pages/resetPassword/ResetPassword.jsx';
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'


function App() {
  const {authUser} = useAuthContext();

  return <div className=' p-4 h-screen flex items-center justify-center'>
    <Routes>
      <Route path="/" element={authUser ? <Home/> : <Navigate to={"/login"} />} />
      <Route path='/login' element={authUser ? <Navigate to={"/"} /> : <Login/>} />
      <Route path='/signup' element={ authUser ? <Navigate to={"/"} /> : <SignUp/>} />
       <Route path='/forgot-password' element={authUser ? <Navigate to={"/"} /> : <ForgotPassword/>} />
      <Route path='/reset-password/:token' element={authUser ? <Navigate to={"/"} /> : <ResetPassword/>} />
    </Routes>
    <Toaster/>
  </div>
}

export default App
