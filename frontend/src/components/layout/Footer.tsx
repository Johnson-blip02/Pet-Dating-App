import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} PetMatch. All rights reserved.
        </div>
        {/* <div className="flex space-x-4">
          <Link
            to="/about"
            className="hover:text-pink-400 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            to="/terms"
            className="hover:text-pink-400 transition-colors duration-200"
          >
            Terms
          </Link>
          <Link
            to="/privacy"
            className="hover:text-pink-400 transition-colors duration-200"
          >
            Privacy
          </Link>
        </div> */}
      </div>
    </footer>
  );
}
