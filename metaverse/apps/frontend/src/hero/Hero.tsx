import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sword } from "lucide-react";
import FeatureSection from "./feature";
import Footer from "@/components/Footer";

const HeroSection: React.FC = () => {
  return (
    <div>
    <section className="bg-zinc-900 text-zinc-100 min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* Title and Subtitle */}
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          Welcome to Metamove
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
        Embark on a captivating 2D metaverse journey! Explore vibrant worlds, create your unique avatar, and forge connections in an ever-evolving digital universe.

        </p>

        {/* Call to Action */}
        <Link to="/signup">
          <Button className="bg-purple-800 text-white hover:bg-purple-700 px-6 py-3 text-lg">
            <Sword className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </Link>
      </div>
    </section>
    <FeatureSection/>
    <Footer/>
    </div>
  );
};

export default HeroSection;
