import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import toast from 'react-hot-toast';
import { endpoints } from '@/services/apis';
import axios from 'axios';
const {
  LOGIN_API
} = endpoints;

const LoginForm: React.FC = () => {

  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async ()=>{
    const toastId = toast.loading("Loading...");
    try {
      const {
        username,
        password
      } = loginData;
      console.log("hii");
      console.log(loginData.username);
      const response = await axios.post(LOGIN_API, {
        username,
        password
      });
      console.log(response);
      if (response.status !== 200) {
        console.log(response.data.message);
        throw new Error(response.data.message)
      }
      toast.success("Login success");
      navigate("/dashbaord");
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
    toast.dismiss(toastId)
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    handleLogin();
  }
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-100">
      <div className="w-full max-w-md bg-zinc-800 shadow-lg rounded-lg p-8">
        {/* Logo and Title */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <LogIn className="text-purple-500 h-8 w-8" />
          <h1 className="text-3xl font-bold text-purple-400">Metamove</h1>
        </div>

        <h2 className="text-center text-xl font-medium mb-4">Login to Your Account</h2>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              className="bg-zinc-700 border-zinc-600 text-zinc-200 placeholder-zinc-400"
              onChange={
                (e)=>{
                  setLoginData((prev)=>({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              }
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="bg-zinc-700 border-zinc-600 text-zinc-200 placeholder-zinc-400"
              onChange={
                (e)=>{
                  setLoginData((prev)=>({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit"
            className="w-full bg-purple-800 text-white hover:bg-purple-700"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </form>

        {/* Footer Links */}
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-400 hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
