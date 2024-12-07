import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Logo or Brand Name */}
        <h2 className="text-3xl font-bold text-purple-400 mb-6">Metamove</h2>

        {/* Navigation Links */}
        <nav className="mb-8">
          <ul className="flex justify-center space-x-12">
            <li>
              <a
                href="#features"
                className="hover:text-purple-400 transition-colors text-lg"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#adventures"
                className="hover:text-purple-400 transition-colors text-lg"
              >
                Adventures
              </a>
            </li>
            <li>
              <a
                href="#community"
                className="hover:text-purple-400 transition-colors text-lg"
              >
                Community
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-purple-400 transition-colors text-lg"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </nav>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">About Us</h3>
            <p className="text-zinc-400">
              Learn more about our mission to bring thrilling adventures to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">Support</h3>
            <p className="text-zinc-400">
              Need help? Visit our FAQ section or contact our support team for assistance.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">Join Us</h3>
            <p className="text-zinc-400">
              Become a part of our growing community and start your adventure today.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-zinc-400 text-sm">
          &copy; {new Date().getFullYear()} Metamove. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;