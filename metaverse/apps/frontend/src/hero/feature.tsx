import React from "react";
import { Shield, ScrollText, Users } from "lucide-react";

const FeatureSection: React.FC = () => {
  return (
    <section className="bg-zinc-800 text-zinc-100 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-purple-400 mb-6">
          Why Choose Metamove?
        </h2>
        <p className="text-zinc-300 text-lg mb-12">
          Discover the unique features that make Metamove the ultimate adventure platform.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-zinc-900 rounded-lg shadow-md p-6">
            <Shield className="text-purple-500 h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Epic Quests</h3>
            <p className="text-zinc-300">
              Dive into thrilling adventures and explore mythical lands with endless challenges.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-zinc-900 rounded-lg shadow-md p-6">
            <ScrollText className="text-purple-500 h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Dynamic Stories</h3>
            <p className="text-zinc-300">
              Every choice matters—craft your story and leave your mark on the world.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-zinc-900 rounded-lg shadow-md p-6">
            <Users className="text-purple-500 h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-zinc-300">
              Connect with adventurers around the globe and share your achievements.
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <img
            src="/images/quest.jpg"
            alt="Epic Quest"
            className="rounded-lg shadow-lg w-full md:w-[30%]"
          />
          <img
            src="/images/story.jpg"
            alt="Dynamic Stories"
            className="rounded-lg shadow-lg w-full md:w-[30%]"
          />
          <img
            src="/images/community.jpg"
            alt="Community"
            className="rounded-lg shadow-lg w-full md:w-[30%]"
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
