import React, { useEffect, useState } from 'react';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Sword, 
  Shield, 
  ScrollText, 
  UserCircle2, 
  LogIn,
  UserPlus, 
  PlusCircle,
  Mail,
  Info,
  Award,
  LifeBuoy,
  Grid
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/services/operations/authApi';

interface MetamoveNavbarProps {
  username?: string;
}

const MetamoveNavbar: React.FC<MetamoveNavbarProps> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoggedIn(!!token);
    console.log(user?.avatar);
  }, [token, user]);

  // Function to handle logout action
  const handleLogout = () => {
    // Add your logout logic here, e.g., clearing token, redirecting, etc.
    dispatch(logout(navigate));
    setIsModalOpen(false); // Close the modal after logout
  };

  return (
    <nav className="bg-zinc-950 text-zinc-100 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Logo */}
       <Link to={"/"}>
       <div className="flex items-center space-x-2">
          <Sword className="text-purple-500" />
          <span className="text-2xl font-bold text-purple-400">Metamove</span>
        </div>
       </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            {/* Contact Us Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
                <Mail className="mr-2 h-4 w-4" /> Contact Us
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-zinc-800 border-none text-zinc-200">
                <div className="grid w-[200px] p-2">
                  <NavigationMenuLink className="p-2 hover:bg-zinc-700 rounded-md">
                    Email Support
                  </NavigationMenuLink>
                  <NavigationMenuLink className="p-2 hover:bg-zinc-700 rounded-md">
                    Live Chat
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* About Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
                <Info className="mr-2 h-4 w-4" /> About
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-zinc-800 border-none text-zinc-200">
                <div className="grid w-[200px] p-2">
                  <NavigationMenuLink className="p-2 hover:bg-zinc-700 rounded-md">
                    Game Overview
                  </NavigationMenuLink>
                  <NavigationMenuLink className="p-2 hover:bg-zinc-700 rounded-md">
                    Team
                  </NavigationMenuLink>
                  <NavigationMenuLink className="p-2 hover:bg-zinc-700 rounded-md">
                    Development Roadmap
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Additional Game Sections */}
            <NavigationMenuItem>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-zinc-800 text-zinc-200 hover:bg-zinc-700`}>
                <Award className="mr-2 h-4 w-4" /> Leaderboard
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-zinc-800 text-zinc-200 hover:bg-zinc-700`}>
                <LifeBuoy className="mr-2 h-4 w-4" /> Support
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* User and Actions */}
      <div className="flex items-center space-x-4 mr-8">
        {isLoggedIn ? (
          <>
            <Button variant="outline" className="bg-purple-800 text-white hover:bg-purple-700 border-none transition-all duration-300 ease-in-out">
              <PlusCircle className="mr-2 h-6 w-6 transform hover:scale-110" /> Create Space
            </Button>
            <Button variant="outline" className="bg-purple-800 text-white hover:bg-purple-700 border-none transition-all duration-300 ease-in-out">
              <Grid className="mr-2 h-6 w-6 transform hover:scale-110" /> My Spaces
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar?.imageUrl} alt="User Avatar" />
                  <AvatarFallback className="bg-purple-800 text-white">
                    <UserCircle2 />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <Link to={"/dashboard/my-profile"}>
                <DropdownMenuItem className="hover:bg-zinc-700">Profile</DropdownMenuItem></Link>
                <Link to={"/dashboard/settings"}>
                <DropdownMenuItem className="hover:bg-zinc-700">Settings</DropdownMenuItem></Link>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem className="hover:bg-zinc-700">Create Space</DropdownMenuItem>
                {/* Logout Button with Confirmation */}
                <DropdownMenuItem className="hover:bg-zinc-700 text-red-400" onClick={() => setIsModalOpen(true)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex space-x-2">
            <Link to={"/login"}>
              <Button variant="outline" className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border-zinc-700">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button className="bg-purple-800 text-white hover:bg-purple-700">
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Modal for Logout Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-zinc-100 mb-4">Confirm Logout</h2>
            <p className="text-zinc-300 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end">
              <Button onClick={() => setIsModalOpen(false)} className="mr-2 bg-zinc-600 text-zinc-200">
                Cancel
              </Button>
              <Button onClick={handleLogout} className="bg-red-600 text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MetamoveNavbar;
