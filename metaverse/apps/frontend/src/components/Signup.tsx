import { useEffect, useState } from 'react';
import axios from "axios"
import { endpoints, publicEndpoints } from '@/services/apis';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { 
  Sword, 
  Shield, 
  Lock, 
  User, 
  GamepadIcon, 
  StarIcon, 
  Star,
  UploadIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigate, useNavigate } from 'react-router-dom';
const {
  GET_ALL_AVATARS
} = publicEndpoints;
const {
  SIGNUP_API
} = endpoints;
const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleSignup = async () => {
    const BASE_URL = "http://localhost:3000/api/v1"
    console.log('Signup', { username, password, currentAvatar });
    const toastId = toast.loading("Loading...");
    try {
      console.log("hii");
      const response = await axios.post(SIGNUP_API, {
        username,
        password,
        avatarId: currentAvatar.id,
        type:"user"
      });
      console.log(response);
      if (response.status != 200) {
        console.log(response.data.message);
        throw new Error(response.data.message)
      }
      toast.success("Signup success");
      navigate("/login");
    } catch (error) {
      toast.error("Signup Failed");
    }
    toast.dismiss(toastId)
  };

  useEffect(()=>{
    const fetchAvatar=async ()=>{
      try {
        const response = await axios.get(GET_ALL_AVATARS);
        setAvatar(response.data.avatars);
        setCurrentAvatar(response.data.avatars[0]);
        console.log('API Response:', response.data.avatars);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }finally{
        setLoading(false)
      }
    }
    fetchAvatar();
  },[])
  return (
    <div className="w-full h-[100vh] lg:grid lg:grid-cols-2 bg-black">
              <div className="flex items-center justify-center py-12 px-4 bg-zinc-900 ">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-purple-400 flex items-center justify-center">
              <StarIcon className="mr-2 text-purple-500" /> Sign Up
            </h1>
            <p className="text-zinc-400">Enter your details to create your Metamove account</p>
          </div>

          {/* Avatar Selection */}
          <div className="grid gap-4">
            <div className="flex justify-center items-center space-x-4">
              {/* Main Avatar */}
              <Avatar className="w-24 h-24 border-4 border-purple-600">
                <AvatarImage src={currentAvatar?.imageUrl || "/api/placeholder/100/100"} alt="User Avatar" />
                <AvatarFallback className="bg-zinc-800">
                  <User className="text-purple-500" />
                </AvatarFallback>
              </Avatar>

              {/* Avatar Upload */}
              <div className='text-3xl font-bold text-white'>{currentAvatar?.name}</div>
            </div>

            {/* Predefined Avatar Options */}
            <div className="flex justify-center space-x-2 mb-4">
              {avatar?.map((data, index) => (
                <Avatar 
                  key={index} 
                  className="flex justify-center items-center w-14 h-14 cursor-pointer hover:border-2 hover:border-purple-500"
                  onClick={() => setCurrentAvatar(data)}
                >
                  <AvatarImage src={data?.imageUrl} alt={`Avatar ${data.name}`} className={`${data.id===currentAvatar.id ? "border-4 border-purple-600" : ""}`}/>
                  <AvatarFallback><Star /></AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-zinc-300 flex items-center">
                <User className="mr-2 text-purple-500" /> Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your legendary name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 
                           focus:ring-2 focus:ring-purple-600"
                icon={<User className="text-purple-500" />}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-zinc-300 flex items-center">
                <Lock className="mr-2 text-purple-500" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create your realm guardian code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 
                           focus:ring-2 focus:ring-purple-600"
                icon={<Lock className="text-purple-500" />}
              />
            </div>
            <Button 
              onClick={handleSignup}
              disabled={!username || !password}
              className="w-full bg-purple-800 text-white hover:bg-purple-700 
                         disabled:bg-zinc-700 disabled:text-zinc-500 
                         flex items-center justify-center"
            >
              <Shield className="mr-2" /> Forge Your Destiny
            </Button>
          </div>
        </div>
      </div>
      {/* Right Side - Mystical Image */}
      <div className="hidden lg:block relative">
        <div className="relative z-10 p-12 text-white flex flex-col justify-center ">
          <h1 className="text-4xl font-bold mb-4 text-purple-400 flex items-center">
            <Sword className="mr-3 text-purple-500" /> Metamove
          </h1>
          <p className="text-xl text-zinc-300 flex items-center">
            <GamepadIcon className="mr-2" /> 
            Forge your legend in the eternal multiverse. 
            Where reality bends and myths are born.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupForm;