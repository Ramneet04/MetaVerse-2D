import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import SignupForm from "./components/Signup"
import LoginForm from "./components/Login"
import HeroSection from "./hero/Hero"
import Arena from "./game/Game"
import Dashboard from "./pages/Dashboard"
import MyProfile from "./components/Dashboard/myprofile"
import Settings from "./components/Dashboard/settings"


function App() {

  return (
    <>
    <div className="w-[100vw] h-[100vh] overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection/>}></Route>
        <Route path="/signup" element={<SignupForm/>}></Route>
        <Route path="/login" element={<LoginForm/>}></Route>
        <Route path="/arena" element={<Arena/>}></Route>

        <Route element={<Dashboard/>}>

        <Route path="dashboard/my-profile" element={<MyProfile/>}></Route>
        <Route path="dashboard/settings" element={<Settings/>}></Route>

        </Route>
      </Routes>

    </div>
    </>
  )
}

export default App
