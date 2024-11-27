import React from 'react';
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
  UserPlus 
} from "lucide-react";
import { Link } from 'react-router-dom';

interface MetamoveNavbarProps {
  isLoggedIn?: boolean;
  username?: string;
}

const MetamoveNavbar: React.FC<MetamoveNavbarProps> = ({ 
  isLoggedIn = false, 
  username = 'Player' 
}) => {
  return (
    <nav className="bg-zinc-950 text-zinc-100 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Sword className="text-purple-500" />
          <span className="text-2xl font-bold text-purple-400">Metamove</span>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
                Realms
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-zinc-800 border-none text-zinc-200">
                <div className="grid w-[200px] p-2">
                  <NavigationMenuLink 
                    className="p-2 hover:bg-zinc-700 rounded-md"
                  >
                    Mythic Lands
                  </NavigationMenuLink>
                  <NavigationMenuLink 
                    className="p-2 hover:bg-zinc-700 rounded-md"
                  >
                    Shadow Kingdoms
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink 
                className={`${navigationMenuTriggerStyle()} bg-zinc-800 text-zinc-200 hover:bg-zinc-700`}
              >
                <Shield className="mr-2 h-4 w-4" /> Quests
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* User and Actions */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User Avatar" />
                  <AvatarFallback className="bg-purple-800 text-white">
                    <UserCircle2 />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem className="hover:bg-zinc-700">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-700">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem className="hover:bg-zinc-700 text-red-400">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" 
              className="bg-purple-800 text-white hover:bg-purple-700 border-none"
            >
              <ScrollText className="mr-2 h-4 w-4" /> Inventory
            </Button>
          </>
        ) : (
          <div className="flex space-x-2">
            <Link to={"/login"}>
            <Button 
              variant="outline" 
              className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border-zinc-700"
            >
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
            </Link>
            <Link to={"/signup"}>
            <Button 
              className="bg-purple-800 text-white hover:bg-purple-700"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MetamoveNavbar;