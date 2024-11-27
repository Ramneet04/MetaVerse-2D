import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sword, 
  Shield, 
  Lock, 
  User, 
  GamepadIcon, 
  StarIcon, 
  Star,
  ImageIcon,
  UploadIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleSignup = () => {
    console.log('Signup', { username, password, avatar });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const predefinedAvatars = [
    "/api/placeholder/100/100",
    "/api/placeholder/100/100",
    "/api/placeholder/100/100",
    "/api/placeholder/100/100"
  ];

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
                <AvatarImage src={avatar || "/api/placeholder/100/100"} alt="User Avatar" />
                <AvatarFallback className="bg-zinc-800">
                  <User className="text-purple-500" />
                </AvatarFallback>
              </Avatar>

              {/* Avatar Upload */}
              <div>
                <input 
                  type="file" 
                  id="avatarUpload" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <label 
                  htmlFor="avatarUpload" 
                  className="cursor-pointer bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 inline-flex items-center"
                >
                  <UploadIcon className="text-purple-500 mr-2" /> Upload
                </label>
              </div>
            </div>

            {/* Predefined Avatar Options */}
            <div className="flex justify-center space-x-2 mb-4">
              {predefinedAvatars.map((src, index) => (
                <Avatar 
                  key={index} 
                  className="w-12 h-12 cursor-pointer hover:border-2 hover:border-purple-500"
                  onClick={() => setAvatar(src)}
                >
                  <AvatarImage src={src} alt={`Avatar ${index + 1}`} />
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